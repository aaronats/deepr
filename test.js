const is = require('is');
const { expect } = require('chai');
const deepr = require('./index');

/*
  TODO: Finish tests
*/

describe('Deepr', function() {

  describe('Arrays', function() {

    describe('set', function() {
      it('should set value of the array', function() {
        const arr = deepr.merge([1], [2]);
        expect(arr.length).to.equal(1);
        expect(arr[0]).to.equal(2);
      });
    });

    describe('&push', function() {
      it('should push a value to the array', function() {
        const arr = deepr.merge([1], ['&push', 2]);
        expect(arr.length).to.equal(2);
        expect(arr.join()).to.equal([1,2].join());
      });
    });

    describe('&concat', function() {
      it('should concat a value to the array', function() {
        const arr = deepr.merge([1], ['&concat', [2, 3]]);
        expect(arr.length).to.equal(3);
        expect(arr.join()).to.equal([1,2,3].join());
      });
    });

    describe('&pop', function() {
      it('should pop a value from the array', function() {
        const arr = deepr.merge([1,2,3], ['&pop']);
        expect(arr.length).to.equal(2);
        expect(arr.join()).to.equal([1,2].join());
      });
    });

    describe('&shift', function() {
      it('should shift a value from the array', function() {
        const arr = deepr.merge([1,2,3], ['&shift']);
        expect(arr.length).to.equal(2);
        expect(arr.join()).to.equal([2,3].join());
      });
    });

    describe('&unshift', function() {
      it('should unshift a value to the array', function() {
        const arr = deepr.merge([1,2,3], ['&unshift', 0]);
        expect(arr.length).to.equal(4);
        expect(arr.join()).to.equal([0,1,2,3].join());
      });
    });
  });

  describe('Objects', function() {
    it('should deep merge objects', function() {
      const res = deepr.merge({
        nested: { key: 'val' }
      }, {
        nested: { key: 'deep val' }
      });
      expect(res.nested.key).to.equal('deep val');
    });

    it('should set to empty object', function() {
      const res = deepr.merge({
        object: { key: 'val' },
      }, {
        object: '&={}'
      });
      expect(is.empty(res.object)).to.equal(true);
    });

    it('should set to empty array', function() {
      const res = deepr.merge({
        object: { key: 'val' },
      }, {
        object: '&=[]'
      });
      expect(is.empty(res.object)).to.equal(true);
    });
  });

  describe('Primatives', function() {
    it('should set primative values', function() {
      const res = deepr.merge({
        truth: true,
        integer: 1,
        string: 'prev',
        type: 'string'
      }, {
        truth: false,
        integer: 2,
        string: 'next',
        add: 'key',
        type: 1
      });
      expect(res.truth).to.equal(false);
      expect(res.integer).to.equal(2);
      expect(res.string).to.equal('next');
      expect(res.add).to.equal('key');
      expect(res.type).to.equal(1);
    });

    it('should add one to the value', function() {
      const res = deepr.merge({}, {
        counts: { up: '&+=1' }
      });
      expect(res.counts.up).to.equal(1);
    });

    it('should subtract one from the value', function() {
      const res = deepr.merge({ up: 0 }, { up: '&-=1' });
      expect(res.up).to.equal(-1);
    });

    it('should multiply the value by 5', function() {
      const res = deepr.merge({ up: 5 }, { up: '&*=5' });
      expect(res.up).to.equal(25);
    });

    it('should divide the value by 5', function() {
      const res = deepr.merge({ up: 25 }, { up: '&/=5' });
      expect(res.up).to.equal(5);
    });

  });

});
