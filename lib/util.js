
module.exports.merge = function merge(obj, options){
  for(i in options) obj[i] = options[i];
  return obj;
};

module.exports.getBytes = function getBytes(size){
  if(typeof size === 'number') return size;
  else if(typeof size === 'string'){
    var num = parseFloat(size);
    if(isNaN(num)) return null;
    var unit = size.trim().toLowerCase().slice(-1);
    switch(unit){
      case 'k': num *= 1024; break;
      case 'm': num *= 1024 * 1024; break;
      case 'g': num *= 1024 * 1024 * 1024; break;
    }
    return num;
  }
  else return null;
};

module.exports.getTimestamp = function getTimestamp(d){
  var d = d || new Date();

  return zpad(d.getMonth()+1)
    + zpad(d.getDate())
    + (""+d.getFullYear()).slice(2)
    + "_"
    + zpad(d.getHours())
    + zpad(d.getMinutes())
    + zpad(d.getSeconds());
};

function zpad(n){ // zero pad
  return pad(n+"", 2, 0);
}
module.exports.zpad = zpad;

function pad(str, len, chr, right){
  while(str.length < len){
    if(right) str += chr;
    else str = chr + str;
  }
  return str;
}
module.exports.pad = pad;