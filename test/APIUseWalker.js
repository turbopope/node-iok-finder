const assert = require('chai').assert;
const APIUseWalker = require('../lib/APIUseWalker');

describe('APIUseWalker', function() {
  describe('#pruneUnrequired()', function() {
    it('should retain uses of required variables', function() {
      let walker = new APIUseWalker();
      walker.record_use('fs', 'john');
      walker.record_use('crypto', 'jade');
      walker.record_require('fs', 'fs');
      walker.pruneUnrequired();
      assert.include(Array.from(walker._uses.keys()), 'fs');
    });
    it('should remove uses of unrequired variables', function() {
      let walker = new APIUseWalker();
      walker.record_use('fs', 'john');
      walker.record_use('crypto', 'jade');
      walker.record_require('fs', 'fs');
      walker.pruneUnrequired();
      assert.notInclude(Array.from(walker._uses.keys()), 'crypto');
    });
    it('should retain uses of global objects', function() {
      let walker = new APIUseWalker();
      walker.record_use('Array', 'john');
      walker.record_use('String', 'john');
      walker.record_use('Object', 'john');
      walker.record_use('Map', 'john');
      walker.record_use('JSON', 'john');
      walker.record_use('Promise', 'john');
      walker.pruneUnrequired();
      assert.include(Array.from(walker._uses.keys()), 'Array');
      assert.include(Array.from(walker._uses.keys()), 'String');
      assert.include(Array.from(walker._uses.keys()), 'Object');
      assert.include(Array.from(walker._uses.keys()), 'Map');
      assert.include(Array.from(walker._uses.keys()), 'JSON');
      assert.include(Array.from(walker._uses.keys()), 'Promise');
    });
  });

  describe('#pruneLocalModuleRequires()', function() {
    let walker;
    before(function() {
      walker = new APIUseWalker();
      walker.record_require('fs', 'fs');
      walker.record_require('request', 'request');
      walker.record_require('a', './a');
      walker.record_require('c', '../b/c');
      walker.pruneLocalModuleRequires();
    })

    it('should retain requires of node modules', function() {
      assert.include(Array.from(walker._requires.keys()), 'fs');
    });
    it('should retain requires of npm modules', function() {
      assert.include(Array.from(walker._requires.keys()), 'request');
    });
    it('should remove requires of internal modules', function() {
      assert.notInclude(Array.from(walker._requires.keys()), 'a');
      assert.notInclude(Array.from(walker._requires.keys()), 'c');
    });
  });
});