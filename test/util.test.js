var should = require('should');
var util = require('../lib/util');


describe('Utilities', function(){
  
  it('should merge', function(){
    var obj = util.merge({temp: 75, clouds: 'none', sunny: true}, {temp: 80});
    obj.temp.should.equal(80);
    obj.clouds.should.equal('none');
  });
  
  it('should convert to bytes', function(){
    should.not.exist(util.getBytes());
    util.getBytes(1).should.be.a('number');
    util.getBytes(430).should.equal(430);
    util.getBytes('1k').should.equal(1024);
    util.getBytes('.5k').should.equal(512);
    util.getBytes('1m').should.equal(1024*1024);
    util.getBytes('1g').should.equal(1024*1024*1024);
    util.getBytes('1K').should.equal(1024); // uppercase
    util.getBytes('  1 k   ').should.equal(1024);
    should.not.exist(util.getBytes('break 1k'));
  });
  
  it('should create timestamp string', function(){
    util.getTimestamp().match(/^[0-9]{6}_[0-9]{6}$/);
    var str = util.getTimestamp(new Date("May 17 2013 11:20:32"));
    str.should.equal('051713_112032');
  });
  
  
});