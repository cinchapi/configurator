#!/usr/bin/env node

/*
* Cinchapi Inc. CONFIDENTIAL
* Copyright (c) 2018 Cinchapi Inc. All Rights Reserved.
*
* All information contained herein is, and remains the property of Cinchapi.
* The intellectual and technical concepts contained herein are proprietary to
* Cinchapi and may be covered by U.S. and Foreign Patents, patents in process,
* and are protected by trade secret or copyright law. Dissemination of this
* information or reproduction of this material is strictly forbidden unless
* prior written permission is obtained from Cinchapi. Access to the source code
* contained herein is hereby forbidden to anyone except current Cinchapi
* employees, managers or contractors who have executed Confidentiality and
* Non-disclosure agreements explicitly covering such access.
*
* The copyright notice above does not evidence any actual or intended
* publication or disclosure of this source code, which includes information
* that is confidential and/or proprietary, and is a trade secret, of Cinchapi.
*
* ANY REPRODUCTION, MODIFICATION, DISTRIBUTION, PUBLIC PERFORMANCE, OR PUBLIC
* DISPLAY OF OR THROUGH USE OF THIS SOURCE CODE WITHOUT THE EXPRESS WRITTEN
* CONSENT OF COMPANY IS STRICTLY PROHIBITED, AND IN VIOLATION OF APPLICABLE
* LAWS AND INTERNATIONAL TREATIES. THE RECEIPT OR POSSESSION OF THIS SOURCE
* CODE AND/OR RELATED INFORMATION DOES NOT CONVEY OR IMPLY ANY RIGHTS TO
* REPRODUCE, DISCLOSE OR DISTRIBUTE ITS CONTENTS, OR TO MANUFACTURE, USE, OR
* SELL ANYTHING THAT IT MAY DESCRIBE, IN WHOLE OR IN PART.
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