import sys
import bpy

# -- STEP Import --

# Dependencies :
# - https://gumroad.com/l/stepper
# - https://blenderartists.org/t/step-import/1203804/199

# How we proceed:
# 1. First, we use the very good plugin by ambi: https://gumroad.com/l/stepper
# 2. Then, we use a second one by vink to take the color from the vertices and put them as material
# 3. Finally, we export the file as FBX

# 0. Extract the src/dest paths.
# The argv look like this. We don't care about whats before the "--"
# blender -b --python .\step_to_fbx.py -- "Source (STEP)/LUMINAIRE AIRLIE N°1 PORTE.stp" "Blender (FBX)/LUMINAIRE AIRLIE N°1 PORTE.fbx"
argv = sys.argv
separator_index = argv.index("--")
src = None
dest = None

if separator_index and len(argv) >= separator_index + 3:
    argv = argv[separator_index + 1:]
    src = argv[0]
    dest = argv[1]

if src is None or dest is None:
    print('\nYou must provide the file to process and the destination folder like this:', file=sys.stderr)
    print('> blender -b --python .\step_to_fbx.py -- "Source (STEP)/LUMINAIRE AIRLIE N°1 PORTE.stp" "Blender (FBX)"', file=sys.stderr)
    exit(1)

# And remove the cube, while we're at it
print('\nRemoving the damn cube...')
bpy.ops.object.delete()

# 1. Import the STEP file
print('\nSTEP import starting... \'' + src + '\'')
bpy.ops.import_scene.occ_import_step(filepath=src)

# 2. Vertex color => materials
bpy.ops.wi_cadtools.vertexc_mat()

# 3. Export as FBX
bpy.ops.export_scene.fbx(filepath = dest, use_selection = True)

print('\nFinished!')
