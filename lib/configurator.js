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
const yaml = require('js-yaml');
const navigator = require('object-path');

/**
 * A handler for configuration that is sourced from a variety of places (e.g.
 * files and environment variables).
 * <p>
 * Configuration is incrementally sourced from sources in a priority order:
 * <ul>
 * <li>environment variables</li>
 * <li>sources provided to the constructor in order of increasing priority (e.g.
 * the most preferred is listed last)</li>
 * </ul>
 * </p>
 * @param {array} sources 
 */
function Configurator(sources) {
  if(this instanceof Configurator){
    // TODO: in the future we should support multiple config file types, but
    // right now we just need YAML support.
    this.sources = [];
    sources.forEach(source => {
      try {
        var doc = yaml.safeLoad(fs.readFileSync(source, 'utf8'));
        this.sources.push(doc);
      }
      catch(e) {
        // For now, invalid file paths (and other file paths that throw exceptions
        // are being ignored. In the future, we may want to raise these exceptions...)
      }
    });
  }
  else {
    return new Configurator(sources);
  }  
}

/**
 * Return {@code true} if the {@code value} is empty.
 * @param {*} value 
 */
function isEmpty(value){
  return value == null || value == undefined;
}

/**
 * Export a JSON object that contains the values for each of the {@code paths}.
 * @param {*} paths 
 */
Configurator.prototype.export = function(paths) {
  var exported = {};
  paths.forEach(path => {
    let value = this.get(path);
    if(!isEmpty(value)){
      navigator.set(exported, path, value);
    } 
  });
  return JSON.stringify(exported);
}

/**
 * Return the value for the {@code path} or {@code null} if the path does not
 * exist in the configuration.
 * @param {*} path 
 */
Configurator.prototype.get = function(path) {
  var value;
  this.sources.forEach(source => {
    let v = navigator.get(source, path)
    value = !isEmpty(v) ? v : value;
  });
  let env = process.env[path.toUpperCase()];
  return !isEmpty(env) ? env : value;
};

/**
 * Return the value for the {@code path} or the {@code def}ault value if the
 * path does not exist in the configuration.
 * @param {*} path 
 * @param {*} def 
 */
Configurator.prototype.getOrDefault = function(path, def) {
  let value = this.get(path);
  return !isEmpty(value) ? value : def;
}


module.exports = Configurator;