# chuck-ifc [![npm version](https://img.shields.io/npm/v/@mitm/chuck-ifc.svg?style=flat-square)](https://www.npmjs.com/package/@mitm/chuck-ifc) ![license](https://img.shields.io/github/license/mitmadness/chuck-ifc.svg?style=flat-square) [![Travis Build](https://img.shields.io/travis/mitmadness/chuck-ifc.svg?style=flat-square)](https://travis-ci.org/mitmadness/chuck-ifc)

[Chuck](https://github.com/mitmadness/chuck) plugin that converts Industry Foundation Classes models with [IfcOpenShell](http://ifcopenshell.org/).

*:point_right: [@mitm/chuck](https://github.com/mitmadness/chuck), a fully-featured webservice that builds Unity3D asset bundles.*

## :white_check_mark: Requirements

The plugin requires you to install [IfcConvert](http://ifcopenshell.org/ifcconvert.html) globally (at least, it must be available it the `$PATH`).

Ensure that the version you download is superior or equal to version 0.5. The library is known to crash on 0.4 and prior versions.

## :package: Installation & Usage

Like any other chuck plugin, install it alongside of `@mitm/chuck`:

```
yarn add @mitm/chuck-ifc
```

Then load it with chuck (see chuck's documentation about configuration and plugins if necessary):

```
CHUCK_STEPMODULEPLUGINS=@mitm/chuck-ifc yarn chuck
```
