# 3D 폰 목업 샷 — 앱 화면 캡처를 폰 화면에 입혀 회전·다가오는 컷을 PNG 시퀀스로 (투명 배경).
# 편집 장면에서는 CLIP.show 로 재생한다 (clip.json 을 같이 쓴다).
#   blender --background --python toolkit/blender/phone.py -- --screen 앱캡처.png --out lectures/NNN/clips/phone \
#           [--frames 90] [--w 1080] [--h 1920] [--fps 30] [--color 1f1e1d] [--samples 32]
# 결정적: 키프레임만 쓰고 난수는 없다. 렌더러는 EEVEE (빠름).
import bpy, sys, os, json, math, argparse

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument("--screen", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--frames", type=int, default=90)
ap.add_argument("--w", type=int, default=1080)
ap.add_argument("--h", type=int, default=1920)
ap.add_argument("--fps", type=int, default=30)
ap.add_argument("--color", default="1f1e1d", help="폰 몸체 색 (hex)")
ap.add_argument("--samples", type=int, default=32)
a = ap.parse_args(argv)

hexrgb = lambda h: tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try:
        sc.render.engine = eng
        break
    except TypeError:
        pass
sc.render.resolution_x, sc.render.resolution_y, sc.render.fps = a.w, a.h, a.fps
sc.render.film_transparent = True
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
sc.frame_start, sc.frame_end = 1, a.frames
try:
    sc.eevee.taa_render_samples = a.samples
except AttributeError:
    pass
sc.view_settings.view_transform = "Standard"  # 화면 캡처 색이 바래지 않게

# 화면 비율에 맞춘 폰
img = bpy.data.images.load(os.path.abspath(a.screen))
ratio = img.size[0] / img.size[1]
H = 2.0; W = H * ratio
root = bpy.data.objects.new("phone", None); sc.collection.objects.link(root)

def mat(name, rgb, metal=0.0, rough=0.4):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1); b.inputs["Metallic"].default_value = metal; b.inputs["Roughness"].default_value = rough
    return m

bpy.ops.mesh.primitive_cube_add(size=1)
body = bpy.context.object; body.name = "body"; body.parent = root
body.scale = (W + 0.12, H + 0.12, 0.09)
bpy.ops.object.transform_apply(scale=True)  # 비율을 먼저 굳혀야 둥근 모서리가 고르게
bev = body.modifiers.new("bevel", "BEVEL"); bev.width = 0.1; bev.segments = 12
body.data.materials.append(mat("body", hexrgb(a.color), metal=0.6, rough=0.25))
bpy.ops.object.shade_smooth()

# 화면: 캡처를 발광 재질로 (조명과 상관없이 원래 밝기)
bpy.ops.mesh.primitive_plane_add(size=1)
scr = bpy.context.object; scr.name = "screen"; scr.parent = root
scr.scale = (W, H, 1); scr.location = (0, 0, 0.046)
sm = bpy.data.materials.new("screen"); sm.use_nodes = True
nt = sm.node_tree; nt.nodes.clear()
tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = img
em = nt.nodes.new("ShaderNodeEmission"); em.inputs["Strength"].default_value = 1.0
out = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(tex.outputs["Color"], em.inputs["Color"]); nt.links.new(em.outputs["Emission"], out.inputs["Surface"])
scr.data.materials.append(sm)

# 조명·카메라
for loc, e in (((3, -2, 5), 400), ((-4, 1, 3), 150)):
    L = bpy.data.lights.new("key", "AREA"); L.energy = e; L.size = 4
    o = bpy.data.objects.new("key", L); o.location = loc; sc.collection.objects.link(o)
    o.rotation_euler = (math.atan2(math.hypot(loc[0], loc[1]), loc[2]), 0, math.atan2(loc[1], loc[0]) + math.pi / 2)
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); sc.collection.objects.link(cam); sc.camera = cam
cam.data.lens = 50
cam.rotation_euler = (0, 0, 0)

# 움직임: 비스듬히 누운 폰이 돌아서 정면으로, 카메라는 다가온다 (ease)
def key(obj, f, **kw):
    for k, v in kw.items():
        setattr(obj, k, v); obj.keyframe_insert(k, frame=f)
key(root, 1, rotation_euler=(math.radians(-18), math.radians(38), math.radians(-8)), location=(0.25, -0.15, 0))
key(root, int(a.frames * 0.75), rotation_euler=(0, 0, 0), location=(0, 0, 0))
key(root, a.frames, rotation_euler=(0, math.radians(-3), 0), location=(0, 0.03, 0))
key(cam, 1, location=(0, 0, H * 3.4))
key(cam, a.frames, location=(0, 0, H * 2.1))
for o in (root, cam):
    for fc in o.animation_data.action.fcurves if hasattr(o.animation_data.action, "fcurves") else []:
        for kp in fc.keyframe_points:
            kp.interpolation = "BEZIER"; kp.easing = "EASE_IN_OUT"

os.makedirs(a.out, exist_ok=True)
sc.render.filepath = os.path.join(os.path.abspath(a.out), "#####")  # 00001.png … (CLIP 형식)
bpy.ops.render.render(animation=True)
with open(os.path.join(a.out, "clip.json"), "w") as f:
    json.dump({"frames": a.frames, "fps": a.fps}, f)
print(f"done → {a.out} ({a.frames} frames)")
