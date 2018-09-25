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
 * 
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
 * 
 * @param {*} path 
 */
Configurator.prototype.get = function(path) {
  var value;
  this.sources.forEach(source => {
    let v = navigator.get(source, path)
    value = !isEmpty(v) ? v : value;
  });
  // TODO: look in the environment
  return value;
};

/**
 * 
 * @param {*} path 
 * @param {*} def 
 */
Configurator.prototype.getOrDefault = function(path, def) {
  let value = this.get(path);
  return !isEmpty(value) ? value : def;
}


module.exports = Configurator;