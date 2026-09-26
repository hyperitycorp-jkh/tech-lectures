# 3D 타이틀 컷 — 금속 글자가 어둠 속에서 돌며 나타나고, 뒤에서 색 조명이 테두리를 그린다. 인트로·엔딩·챕터 전환용.
#   blender --background --python toolkit/blender/title.py -- --text "CLAUDE CODE" --out lectures/NNN/clips/title \
#           [--frames 120] [--w 1920] [--h 1080] [--fps 30] [--rim d97757] [--font 경로.ttf]
# 결정적: 키프레임만, 난수 없음. 렌더러 EEVEE. 배경은 검정(투명 원하면 --transparent)
import bpy, sys, os, json, math, argparse

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--text", default="CLAUDE CODE")
ap.add_argument("--out", required=True)
ap.add_argument("--frames", type=int, default=120)
ap.add_argument("--w", type=int, default=1920)
ap.add_argument("--h", type=int, default=1080)
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--rim", default="d97757", help="테두리 조명 색 (hex)")
ap.add_argument("--font", default=None, help="글꼴 파일 (없으면 Blender 기본)")
ap.add_argument("--samples", type=int, default=48)
ap.add_argument("--transparent", action="store_true")
a = ap.parse_args(argv)
hexrgb = lambda h: tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        sc.render.engine = eng; break
    except TypeError:
        pass
sc.render.resolution_x, sc.render.resolution_y, sc.render.fps = a.w, a.h, a.fps
sc.render.film_transparent = a.transparent
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA" if a.transparent else "RGB"
sc.frame_start, sc.frame_end = 1, a.frames
try: sc.eevee.taa_render_samples = a.samples
except AttributeError: pass
for attr in ("use_bloom", "use_gtao", "use_ssr"):  # 버전에 따라 없을 수 있다
    try: setattr(sc.eevee, attr, True)
    except AttributeError: pass
sc.view_settings.view_transform = "AgX"
sc.world = bpy.data.worlds.new("w"); sc.world.use_nodes = True
sc.world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.004, 0.004, 0.006, 1)

# 글자: 두께·모서리 깎기, 어두운 금속
bpy.ops.object.text_add()
txt = bpy.context.object; txt.data.body = a.text
if a.font: txt.data.font = bpy.data.fonts.load(os.path.abspath(a.font))
txt.data.align_x = "CENTER"; txt.data.align_y = "CENTER"
txt.data.extrude = 0.12; txt.data.bevel_depth = 0.025; txt.data.bevel_resolution = 4
txt.rotation_euler = (math.radians(90), 0, 0)
m = bpy.data.materials.new("metal"); m.use_nodes = True
bs = m.node_tree.nodes["Principled BSDF"]
bs.inputs["Base Color"].default_value = (0.08, 0.08, 0.09, 1); bs.inputs["Metallic"].default_value = 1.0; bs.inputs["Roughness"].default_value = 0.18
txt.data.materials.append(m)
bpy.context.view_layer.update()
width = txt.dimensions.x

# 바닥 (반사)
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, -0.62))
fl = bpy.context.object
fm = bpy.data.materials.new("floor"); fm.use_nodes = True
fb = fm.node_tree.nodes["Principled BSDF"]; fb.inputs["Base Color"].default_value = (0.01, 0.01, 0.012, 1); fb.inputs["Roughness"].default_value = 0.08
fl.data.materials.append(fm)

def light(name, kind, loc, energy, color=(1, 1, 1), size=3):
    L = bpy.data.lights.new(name, kind); L.energy = energy; L.color = color
    if kind == "AREA": L.size = size
    o = bpy.data.objects.new(name, L); o.location = loc; sc.collection.objects.link(o)
    tr = o.constraints.new("TRACK_TO"); tr.target = txt; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
    return o
rim = light("rim", "AREA", (0, 5, 1.2), 0, hexrgb(a.rim), size=6)          # 뒤에서 테두리 (점점 켜짐)
key = light("key", "AREA", (-4, -5, 4), 0, (1, 0.97, 0.94), size=4)         # 앞 위에서 (점점 켜짐)
sweep = light("sweep", "SPOT", (-width, -3, 2), 0, (1, 1, 1))               # 글자를 훑고 지나가는 빛
sweep.data.spot_size = math.radians(25); sweep.data.spot_blend = 0.6

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 50
ct = cam.constraints.new("TRACK_TO"); ct.target = txt; ct.track_axis = "TRACK_NEGATIVE_Z"; ct.up_axis = "UP_Y"
dist = max(width * 1.35, 4)

def key_(obj, f, path, val):
    setattr(obj, path, val); obj.keyframe_insert(path, frame=f)
F = a.frames
# 카메라: 옆·아래에서 정면으로 돌아 들어오며 다가온다
key_(cam, 1, "location", (dist * 0.9, -dist * 0.8, -0.1))
key_(cam, int(F * 0.7), "location", (0, -dist, 0.35))
key_(cam, F, "location", (0, -dist * 0.94, 0.4))
# 글자: 살짝 기울었다가 바로 선다
key_(txt, 1, "rotation_euler", (math.radians(90), 0, math.radians(-28)))
key_(txt, int(F * 0.7), "rotation_euler", (math.radians(90), 0, 0))
# 조명: 어둠 → 테두리 → 정면, 그리고 한 번 훑는 빛
for o, pts in ((rim.data, [(1, 0), (int(F * .35), 900), (F, 900)]), (key.data, [(1, 0), (int(F * .45), 0), (int(F * .8), 260), (F, 260)]),
               (sweep.data, [(1, 0), (int(F * .45), 0), (int(F * .55), 1500), (int(F * .8), 0)])):
    for f, e in pts: key_(o, f, "energy", e)
key_(sweep, int(F * .45), "location", (-width, -3, 2)); key_(sweep, int(F * .8), "location", (width, -3, 2))

os.makedirs(a.out, exist_ok=True)
sc.render.filepath = os.path.join(os.path.abspath(a.out), "#####")
bpy.ops.render.render(animation=True)
with open(os.path.join(a.out, "clip.json"), "w") as f:
    json.dump({"frames": F, "fps": a.fps}, f)
print(f"done → {a.out} ({F} frames)")
