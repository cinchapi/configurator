#!/usr/bin/env node

/*
 * Copyright (c) 2018 Cinchapi Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const fs = require('fs');
const argparse = require('argparse');

const cli = new argparse.ArgumentParser({
  prog: 'jsconfig',
  version:  require('../package.json').version,
  addHelp:  true
});

const commands = cli.addSubparsers({
  title: 'commands',
  dest: 'command'
});

const getAction = commands.addParser('get', { addHelp: true });
getAction.addArgument(
  ['-k', '--key', '-p', '--path'],
  {
    help: 'The key whose value to get',
    required: true,
    dest: 'path',   
  }
)

const getOrDefaultAction = commands.addParser('getOrDefault', { addHelp: true });
getOrDefaultAction.addArgument(
  ['-k', '--key', '-p', '--path'],
  {
    help: 'The path to retrieve',
    required: true,
    dest: 'path',   
  }
)
getOrDefaultAction.addArgument(
  ['-d', '--default'],
  {
    help: "The default value to return if the path doesn't exist in the configuration",
    required: true,
    dest: 'def',   
  }
)

const jsonifyAction = commands.addParser('export', { addHelp: true });
jsonifyAction.addArgument(
  ['-k', '--keys', '-p', '--paths'],
  {
    action: 'append',
    help: 'The paths to retrieve and export',
    required: true,
    dest: 'paths',
  }
);

cli.addArgument(
  ['-s', '--source'],
  {
    action: 'append',
    help: 'The keys to get and store in the output file alongside their values',
    required: true,
    dest: 'sources',
  }
);

const options = cli.parseArgs();
const command = options.command;
const configurator = require('..')(options.sources);
if(command == 'get'){
  const path = options.path;
  console.log(configurator.get(path))
}
else if(command == 'getOrDefault'){
  const path = options.path;
  const def = options.def;
  console.log(configurator.getOrDefault(path, def));
}
else if(command == 'export'){
  const paths = options.paths;
  console.log(configurator.export(paths));
}
else {
  throw new Error(command+' is an invalid command');
}

process.exit(0);