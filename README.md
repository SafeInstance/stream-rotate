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

log = rotator({
    path: '/logs'
  , name: 'myapp'
  , size: '1m'
  , retention: 2
  });
  
log = new rotator({...});

log.on('error', function(err){
  // handle errors here
});  
```

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
  - `compress`: {Boolean} {default: false}
  - `flags`: {String} (default: 'a')
  - `encoding`: {Mixed} (default: null)
  - `mode`: {Number} (default: 0600)
  
  
##### size
  One can pass in a {Number} or a {String}. If a string it must start with a number and have one of the following characters appended.
  
  - `k`: converts to kilobytes
  - `m`: converts to megabytes
  - `g`: coverts to gigabytes
  