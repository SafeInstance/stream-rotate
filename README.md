# Stream Rotate

Implements a stream interface that allows log rotation. Manages streams and files automatically.

## Features

## Installation

```bash

npm install stream-rotate
```

## Usage

```js

var rotator = require('stream-rotate');

logstream = rotator({
    path: '/logs'
  , name: 'myapp'
  , size: '1m'
  , retention: 2
  });
  
logstream = new rotator({...});

logstream.on('error', function(err){
  // handle errors here
});  
```

### Express

```

app.use(express.logger({stream: logstream, format: "default"}));
```

### Winston

```js

winston.add(winston.transports.File, {
  stream: logstream
});
```

__note__: This is important since winston does not provide rotation on streams nor options for setting the encoding, mode or flag of the file.


## API

### Stream-Rotate

Returns a file stream that auto rotates based on size or date.

When a current log file is no longer valid (too big or old) then it is moved. The format of that new file is as follows.

{name}\_MMDDYY\_HHMMSS.{ext}

#### Options

  - `path`: {String}
  - `name`: {String}
  - `ext`: {String} (default: 'log')
  - `size`: {Number} Max file size in bytes (optional)
  - `freq`: {} (optional)
  - `retention`: {Number} (default: 2)
  - `poll`: {Number} (default: null) 
  - `compress`: {Boolean} {default: false}
  - `flags`: {String} (default: 'a')
  - `encoding`: {Mixed} (default: null)
  - `mode`: {Number} (default: 0600)

##### path
  Directory to store log files.
  
##### name
  Root name of the file
  
##### ext
  extension for the log file (default: 'log')
  
##### size
  Accepts {Number} or {String}. If string, it must start with a number and have one of the following characters appended.
  
  - `k`: converts to kilobyte(s)
  - `m`: converts to megabyte(s)
  - `g`: coverts to gigabyte(s)

##### freq
  Accepts a {Number} or {String}. If string, it must start with a number ahnd have one of the following characters appended:
  
  - `h`: sets unit to hour(s)
  - `d`: sets unit to day(s)
  - `w`: sets unit to week(s)
  - `m`: sets unit to month(s)

__note__: if {Number} expected unit is in seconds.

Calculations are done based on the creation time of the current file. If the time is exceeded then the file is rotated.

##### retention
  Number of log files to retain. This does not include the current. default = 2. This means a maximum of 3 files can exist.


##### poll
  Option to poll file with fs.Stats. This is only needed when `stream-rotator` does not have exclusive access to the file (default) and other applications could be writing to the file at the same time and your relying on the `size` option. 
  
This is needed because `stream-rotate` relies on getting the file size when the stream is opened and incrementing the size based on the Buffer.length when writes are performed.

If set it should be a {Number} in seconds. 

##### compress
  compress the files (default: false)
  
  __note__: not implemented yet.

##### flags
  A flag used with [fs.open](http://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback). defaults to 'a'.
  
  __note__: needs to be a writable option.
  
##### encoding
  Set the encoding for the stream. defaults to `null` (Buffer). If set to a string it needs to be one of the [supported encodings](http://nodejs.org/api/buffer.html#buffer_buffer).
  
##### mode
  Set the permissions on the fs.writestream. default = 0600
  

## TODO

  - implement readable stream interface
  - robust options on log naming
  - implement compression
  - integration testing


## Licence

(The MIT License)

Copyright (c) 2013 Nathan White nw@nwhite.net

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
