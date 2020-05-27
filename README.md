# chuck-blender [![npm version](https://img.shields.io/npm/v/@mitm/chuck-blender.svg?style=flat-square)](https://www.npmjs.com/package/@mitm/chuck-blender) ![license](https://img.shields.io/github/license/mitmadness/chuck-blender.svg?style=flat-square) [![Travis Build](https://img.shields.io/travis/mitmadness/chuck-blender.svg?style=flat-square)](https://travis-ci.org/mitmadness/chuck-blender)

[Chuck](https://github.com/mitmadness/chuck) plugin to convert STEP files with [Blender](https://www.blender.org/).

*:point_right: [@mitm/chuck](https://github.com/mitmadness/chuck), a fully-featured webservice that builds Unity3D asset bundles.*

## :white_check_mark: Requirements

This plug-in requires you to install [Blender](https://www.blender.org/) and have it available in command line (you may have to add it in the `$PATH`).
To get STEP imports, you need these Blender add-ons:

- [STEPper](https://gumroad.com/l/stepper) by [ambi](https://blenderartists.org/u/ambi/summary)
- [WI CAD Tools](https://blenderartists.org/t/step-import/1203804/199) by [vink](https://blenderartists.org/u/vink/summary)

The Blender GUI is not required so may use a little script to install these. Name a file `setup-addons.py`, and put the code below with the correct paths.

```python
import bpy
# The folder with the plugins
folder = 'C:\Chuck\Applications\Blender\Plugins\'

# Install the STEP importer
bpy.ops.preferences.addon_install(filepath=folder + 'STEP_OCC_import_1.0.0.zip')
bpy.ops.preferences.addon_enable(module='STEPper')

# Install the color fix
bpy.ops.preferences.addon_install(filepath=folder + 'WI CAD Tools.py')
bpy.ops.preferences.addon_enable(module='WI CAD Tools')

bpy.ops.wm.save_userpref()
```

The run this:

```bash
blender -b -P ./setup-addons.py
```

# Formats

The checked boxes are the wired/tested formats.

Blender is able to import the following formats:
 - [ ] Collada (.dae)
 - [ ] Alembic (.abc)
 - [ ] Motion Capture (.bvh)
 - [ ] Scalable Vector Graphics (.svg)
 - [ ] Stanford (.ply)
 - [ ] Stl (.stl)
 - [ ] FBX (.fbx)
 - [ ] gLTF 2.0 (.gltf/.glb)
 - [ ] Wavefront (.obj)
 - [ ] X3D Extensible 3D (.x3d/.wrl)
 - [ ] STEP (.step) with a plugin

Blender is able to export the following formats:

- [ ] Collada (.dae)
 - [ ] Alembic (.abc)
 - [ ] Universal Scene Description (.usd, .usdc, .usda)
 - [ ] Stanford (.ply)
 - [ ] Stl (.stl)
 - [ ] FBX (.fbx)
 - [ ] gLTF 2.0 (.gltf/.glb)
 - [ ] Wavefront (.obj)
 - [ ] X3D Extensible 3D (.x3d/.wrl)

## :package: Installation & Usage

Like any other chuck plugin, install it alongside of `@mitm/chuck`:

```
yarn add @mitm/chuck-blender
```

Then load it with chuck (see chuck's documentation about configuration and plugins if necessary):

```
CHUCK_STEPMODULEPLUGINS=@mitm/chuck-blender yarn chuck
```

## :wrench: Configuration

Like with chuck, configuration is done via environment variables.

| Variable                   | Default                     | Description                                                |
| -------------------------- | --------------------------- | ---------------------------------------------------------- |
| `CHUCK_BLENDER_BLENDERPATH | `blender` (= in the `PATH`) | Path to the [Blender](https://www.blender.org/) executable |
