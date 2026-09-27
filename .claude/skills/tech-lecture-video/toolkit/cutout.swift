// 누끼(배경 제거) — macOS 내장 Vision 으로 PNG 프레임마다 사람(또는 피사체)만 남긴 투명 PNG 를 만든다. 모델 다운로드 없음.
//   swiftc -O toolkit/cutout.swift -o /tmp/cutout && /tmp/cutout <프레임 폴더> <출력 폴더> [--mode person|subject] [--feather 1.5] [--roi x,y,w,h]
//   --roi: 이 영역(0~1, 왼쪽 위 기준) 밖은 버린다 — 벽화·포스터 속 사람까지 잡힐 때
//   person : VNGeneratePersonSegmentationRequest(.accurate) — 사람 전용, 머리카락 경계가 좋고 영상용으로 빠르다 (기본)
//   subject: VNGenerateForegroundInstanceMaskRequest — 사진 앱 '피사체 들어올리기'와 같은 방식, 사람 외 물체도
// 입력은 toolkit/clip.mjs 가 푼 00001.png… 출력도 같은 이름. 장면에서는 원본 프레임 위에 이 PNG 를 겹쳐 '글자가 사람 뒤로' 같은 효과를 만든다.
import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: cutout <inDir> <outDir> [--mode person|subject] [--feather px]"); exit(1) }
let inDir = URL(fileURLWithPath: args[1]), outDir = URL(fileURLWithPath: args[2])
func opt(_ k: String, _ d: String) -> String { if let i = args.firstIndex(of: "--\(k)"), i + 1 < args.count { return args[i + 1] }; return d }
let mode = opt("mode", "person"), feather = Double(opt("feather", "1.5")) ?? 1.5
let roi = opt("roi", "").split(separator: ",").compactMap { Double($0) }
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)
let files = try FileManager.default.contentsOfDirectory(atPath: inDir.path).filter { $0.hasSuffix(".png") || $0.hasSuffix(".jpg") }.sorted()
let ctx = CIContext(options: [.useSoftwareRenderer: false])
let personReq = VNGeneratePersonSegmentationRequest()
personReq.qualityLevel = .accurate
personReq.outputPixelFormat = kCVPixelFormatType_OneComponent8

func mask(for cg: CGImage) throws -> CIImage? {
  let handler = VNImageRequestHandler(cgImage: cg, options: [:])
  if mode == "subject" {
    let req = VNGenerateForegroundInstanceMaskRequest()
    try handler.perform([req])
    guard let r = req.results?.first else { return nil }
    let buf = try r.generateScaledMaskForImage(forInstances: r.allInstances, from: handler)
    return CIImage(cvPixelBuffer: buf)
  }
  try handler.perform([personReq])
  guard let buf = personReq.results?.first?.pixelBuffer else { return nil }
  return CIImage(cvPixelBuffer: buf)
}

let t0 = Date()
for (n, f) in files.enumerated() {
  let src = inDir.appendingPathComponent(f)
  guard let isrc = CGImageSourceCreateWithURL(src as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(isrc, 0, nil) else { continue }
  let img = CIImage(cgImage: cg), W = img.extent.width, H = img.extent.height
  var m = (try? mask(for: cg)) ?? CIImage(color: .black).cropped(to: img.extent)
  // 마스크를 원본 크기로 늘리고 경계를 살짝 부드럽게
  m = m.transformed(by: CGAffineTransform(scaleX: W / m.extent.width, y: H / m.extent.height))
  if roi.count == 4 {  // 영역 밖 마스크 제거 (CoreImage 는 왼쪽 아래 원점)
    let r = CGRect(x: roi[0] * W, y: H - (roi[1] + roi[3]) * H, width: roi[2] * W, height: roi[3] * H)
    let keep = CIImage(color: .white).cropped(to: r).composited(over: CIImage(color: .black).cropped(to: img.extent))
    m = m.applyingFilter("CIMultiplyCompositing", parameters: [kCIInputBackgroundImageKey: keep])
  }
  if feather > 0 { m = m.clampedToExtent().applyingGaussianBlur(sigma: feather).cropped(to: img.extent) }
  let out = img.applyingFilter("CIBlendWithMask", parameters: ["inputBackgroundImage": CIImage(color: .clear).cropped(to: img.extent), "inputMaskImage": m])
  guard let outCG = ctx.createCGImage(out, from: img.extent, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)) else { continue }
  let dst = outDir.appendingPathComponent((f as NSString).deletingPathExtension + ".png")
  guard let d = CGImageDestinationCreateWithURL(dst as CFURL, UTType.png.identifier as CFString, 1, nil) else { continue }
  CGImageDestinationAddImage(d, outCG, nil); CGImageDestinationFinalize(d)
  if (n + 1) % 50 == 0 || n + 1 == files.count { print("cutout \(n + 1)/\(files.count) (\(String(format: "%.1f", Date().timeIntervalSince(t0)))s)") }
}
// clip.json (CLIP.show 가 프레임 수·확장자를 안다) — 입력 fps 를 이어받고 출력은 항상 png
var fps = 30.0
if let d = try? Data(contentsOf: inDir.appendingPathComponent("clip.json")), let j = try? JSONSerialization.jsonObject(with: d) as? [String: Any], let v = j["fps"] as? Double { fps = v }
try? JSONSerialization.data(withJSONObject: ["frames": files.count, "fps": fps, "ext": "png"]).write(to: outDir.appendingPathComponent("clip.json"))
print("done → \(outDir.path)")
