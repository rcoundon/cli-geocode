oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g cli-geocode
$ cli-geocode COMMAND
running command...
$ cli-geocode (--version)
cli-geocode/0.0.0 darwin-arm64 node-v16.19.0
$ cli-geocode --help [COMMAND]
USAGE
  $ cli-geocode COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli-geocode hello PERSON`](#cli-geocode-hello-person)
* [`cli-geocode hello world`](#cli-geocode-hello-world)
* [`cli-geocode help [COMMANDS]`](#cli-geocode-help-commands)
* [`cli-geocode plugins`](#cli-geocode-plugins)
* [`cli-geocode plugins:install PLUGIN...`](#cli-geocode-pluginsinstall-plugin)
* [`cli-geocode plugins:inspect PLUGIN...`](#cli-geocode-pluginsinspect-plugin)
* [`cli-geocode plugins:install PLUGIN...`](#cli-geocode-pluginsinstall-plugin-1)
* [`cli-geocode plugins:link PLUGIN`](#cli-geocode-pluginslink-plugin)
* [`cli-geocode plugins:uninstall PLUGIN...`](#cli-geocode-pluginsuninstall-plugin)
* [`cli-geocode plugins:uninstall PLUGIN...`](#cli-geocode-pluginsuninstall-plugin-1)
* [`cli-geocode plugins:uninstall PLUGIN...`](#cli-geocode-pluginsuninstall-plugin-2)
* [`cli-geocode plugins update`](#cli-geocode-plugins-update)

## `cli-geocode hello PERSON`

Say hello

```
USAGE
  $ cli-geocode hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/rcoundon/cli-geocode/blob/v0.0.0/dist/commands/hello/index.ts)_

## `cli-geocode hello world`

Say hello world

```
USAGE
  $ cli-geocode hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ cli-geocode hello world
  hello world! (./src/commands/hello/world.ts)
```

## `cli-geocode help [COMMANDS]`

Display help for cli-geocode.

```
USAGE
  $ cli-geocode help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for cli-geocode.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.4/src/commands/help.ts)_

## `cli-geocode plugins`

List installed plugins.

```
USAGE
  $ cli-geocode plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ cli-geocode plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.3.2/src/commands/plugins/index.ts)_

## `cli-geocode plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ cli-geocode plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ cli-geocode plugins add

EXAMPLES
  $ cli-geocode plugins:install myplugin 

  $ cli-geocode plugins:install https://github.com/someuser/someplugin

  $ cli-geocode plugins:install someuser/someplugin
```

## `cli-geocode plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ cli-geocode plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ cli-geocode plugins:inspect myplugin
```

## `cli-geocode plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ cli-geocode plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ cli-geocode plugins add

EXAMPLES
  $ cli-geocode plugins:install myplugin 

  $ cli-geocode plugins:install https://github.com/someuser/someplugin

  $ cli-geocode plugins:install someuser/someplugin
```

## `cli-geocode plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ cli-geocode plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ cli-geocode plugins:link myplugin
```

## `cli-geocode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cli-geocode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cli-geocode plugins unlink
  $ cli-geocode plugins remove
```

## `cli-geocode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cli-geocode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cli-geocode plugins unlink
  $ cli-geocode plugins remove
```

## `cli-geocode plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ cli-geocode plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ cli-geocode plugins unlink
  $ cli-geocode plugins remove
```

## `cli-geocode plugins update`

Update installed plugins.

```
USAGE
  $ cli-geocode plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
