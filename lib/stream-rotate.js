

var fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , path = require('path')
  , mkdirp = require('mkdirp')
  , util = require('./util');

module.exports = Rotator;

/*
  Stream-Rotate
  
  Returns a file stream that auto rotates based on size or date
  
  Options
  
    - `path`: {String}
    - `name`: {String}
    - `ext`: {String} (default: 'log')
    - `size`: {Number} Max file size in bytes (optional)
    - `freq`: {} (optional)
    - `retention`: {Number} (default: 2)
    - `compress`: {Boolean} {default: false}
    - `flags`: {String} (default: 'a')
    - `encoding`: {Mixed} (default: null)
    - `mode`: {Number} (default: 0600)
*/

function Rotator(options){
  
  if(!(this instanceof Rotator)) return new Rotator(options);
  
  var self = this;
  
  this.ready = false;
  this._queue = [];
  this.options = util.merge({
    ext: 'log'
  , retention: 2
  , flags: 'a'
  , encoding: null
  , mode: 0600
  }, options);
  
  this._size = util.getBytes(this.options.size);
  this._regex = new RegExp("^"+this.options.name+"[_0-9]{14}\."+this.options.ext);
  
  this._checkPath();
}


Rotator.prototype.__proto__ = EventEmitter.prototype;


Rotator.prototype._checkPath = function(){
  var self = this;
  fs.stat(this.options.path, function(err, stat){
    if(err) mkdirp(self.options.path, function(err){
      if(err) self.error(err);
      else self._create();
    });
    else if(!stat.isDirectory()) 
      self.error(new Error("File exists, can't create Directory."));
    else self._create();
  });
};


Rotator.prototype._create = function(file){
  var self = this
    , opts = this.options
    , file = this._getName();

  this._checkRetention();
  
  try {
    this.stream = fs.createWriteStream(file, {
      flags: opts.flags, encoding: opts.encoding, mode: opts.mode});
    fs.stat(file, function(err, stat){
      // we can't fail. creating a stream and checking the fd may not exist
      if(err) self._stat = { size: 0, ctime: new Date() };
      else self._stat = stat;
      self._attachListeners();
      self._check();
    });
  } catch (err){
    this.error(err);
  }
};


Rotator.prototype._checkRetention = function(){
  var self = this;
  fs.readdir(this.options.path, function(err, files){
    if(err) return self.error(err);
    
    var matches = files.filter(function(file){
      return file.match(self._regex);
    }).sort();
    
    while(matches.length > self.options.retention){
      fs.unlink(path.join(self.options.path, matches.shift()), function(err){
        if(err) self.error(err);
      })
    }
  });
};


Rotator.prototype._attachListeners = function(){
  var self = this;
  ['drain', 'error', 'close', 'pipe'].forEach(function(event){
    self.stream.on(event, function(i){
      self.emit(event, i);
    });
  });
};


Rotator.prototype._check = function(size){
  var passed = true;
  
  if(this._size && ((this._stat.size + (size || 0)) > this._size)) passed = false;
  else this._stat.size += (size || 0);
  
  if(!passed) this._move();
  else this.ready = true;
  
  return passed;
};


Rotator.prototype._move = function(){
  var self = this;
  this.ready = false;
  this._stat = null;
  this.stream.removeAllListeners();
  this.stream.destroy();

  fs.rename(this._getName(), this._getName(true), function(err){
    if(err) self.error(err);
    self._create();
  });
};


Rotator.prototype._getName = function(ts){
  var file = path.join(this.options.path, this.options.name);
  if(ts) file += '_' + util.getTimestamp();
  file += "." + this.options.ext;
  return file;
};


Rotator.prototype.write = function(data, encoding){
  if(this.halt) return this.error(new Error('Stream is BROKEN'));
  this._queue.push([data, encoding]);
  if(!this.ready) return this;
  
  while(this.ready && this._queue.length){
    var item = this._queue.shift();
    
    if(this._check(item[0].length)){
      this.stream.write(item[0], item[1]);
    }
  }
};


Rotator.prototype.__defineGetter__('writable', function(){
  if(!this.stream) return false;
  return this.stream.writable;
});


['end', 'destroy', 'destorySoon'].forEach(function(method){
  Rotator.prototype[method] = function(){
    if(this.stream) return this.stream.apply(this.stream, arguments);
    return this;
  }
});


Rotator.prototype.error = function(err){
  this.halt = true;
  this.emit('error', err);
  return this;
};