const { expect } = require('chai');
const deepr = require('../index');

describe('Deepr', () => {
  describe('merge', () => {
    describe('mergeObject', () => {
      it('should mutably merge an object', () => {
        const obj = { nested: { key: 'value' } };
        const res = deepr.merge(obj, {
          nested: { key: 'newvalue' }
        });

        expect(obj.nested.key).to.eq('newvalue');
        expect(res.nested.key).to.eq('newvalue');
        expect(obj === res).to.be.true;
      });

      it('should immutably merge an object', () => {
        const obj = { nested: { key: 'value' } };
        const res = deepr.merge(obj, {
          nested: { key: 'newvalue' }
        }, true);

        expect(obj.nested.key).to.eq('value');
        expect(res.nested.key).to.eq('newvalue');
        expect(obj === res).to.be.false;
      });

      it('should mutably set the value to a new object', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key:
          ['&=', { newkey: 'newvalue' }]
        });

        expect(obj.key.newkey).to.eq('newvalue');
        expect(res.key.newkey).to.eq('newvalue');
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value to a new object', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key:
          ['&=', { newkey: 'newvalue' }]
        }, true);

        expect(obj.key).to.eq('value');
        expect(res.key.newkey).to.eq('newvalue');
        expect(obj === res).to.be.false;
      });

      it('should mutably set the value to a string', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: ['&=', 'newvalue'] });

        expect(obj.key).to.eq('newvalue');
        expect(res.key).to.eq('newvalue');
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value to a string', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: ['&=', 'newvalue'] }, true);

        expect(obj.key).to.eq('value');
        expect(res.key).to.eq('newvalue');
        expect(obj === res).to.be.false;
      });

      it('should mutably set the value to empty object', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: '&={}' });

        expect(obj.key).to.be.a('object');
        expect(obj.key).to.be.empty;
        expect(res.key).to.be.a('object');
        expect(res.key).to.be.empty;
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value to empty object', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: '&={}' }, true);

        expect(obj.key).to.eq('value');
        expect(res.key).to.be.a('object');
        expect(res.key).to.be.empty;
        expect(obj === res).to.be.false;
      });

      it('should mutably set the value to an empty array', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: '&=[]' });

        expect(obj.key).to.be.a('array');
        expect(obj.key).to.be.empty;
        expect(res.key).to.be.a('array');
        expect(res.key).to.be.empty;
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value to an empty array', () => {
        const obj = { key: 'value' };
        const res = deepr.merge(obj, { key: '&=[]' }, true);

        expect(obj.key).to.eq('value');
        expect(res.key).to.be.a('array');
        expect(res.key).to.be.empty;
        expect(obj === res).to.be.false;
      });
    });

    describe('mergeArray', () => {
      it('should mutably set the value', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: [2] });

        expect(obj.arr.join()).to.eq('2');
        expect(res.arr.join()).to.eq('2');
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: [2] }, true);

        expect(obj.arr.join()).to.eq('1');
        expect(res.arr.join()).to.eq('2');
        expect(obj === res).to.be.false;
      });

      it('should mutably set the value of a new key', () => {
        const obj = {};
        const res = deepr.merge(obj, { arr: [2] });

        expect(obj.arr.join()).to.eq('2');
        expect(res.arr.join()).to.eq('2');
        expect(obj === res).to.be.true;
      });

      it('should immutably set the value of a new key', () => {
        const obj = {};
        const res = deepr.merge(obj, { arr: [2] }, true);

        expect(obj.arr).to.be.undefined;
        expect(res.arr.join()).to.eq('2');
        expect(obj === res).to.be.false;
      });

      it('should mutably push a value to the array', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: ['&push', 2] });

        expect(obj.arr.join()).to.eq('1,2');
        expect(res.arr.join()).to.eq('1,2');
        expect(obj === res).to.be.true;
      });

      it('should immutably push a value to the array', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: ['&push', 2] }, true);

        expect(obj.arr.join()).to.eq('1');
        expect(res.arr.join()).to.eq('1,2');
        expect(obj === res).to.be.false;
      });

      it('should mutably concat a value to the array', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: ['&concat', [2, 3]] });

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('1,2,3');
        expect(obj === res).to.be.true;
      });

      it('should immutably concat a value to the array', () => {
        const obj = { arr: [1] };
        const res = deepr.merge(obj, { arr: ['&concat', [2, 3]] }, true);

        expect(obj.arr.join()).to.eq('1');
        expect(res.arr.join()).to.eq('1,2,3');
        expect(obj === res).to.be.false;
      });

      it('should mutably pop the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&pop'] });

        expect(obj.arr.join()).to.eq('1,2');
        expect(res.arr.join()).to.eq('1,2');
        expect(obj === res).to.be.true;
      });

      it('should immutably pop the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&pop'] }, true);

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('1,2');
        expect(obj === res).to.be.false;
      });

      it('should mutably shift a value from the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&shift'] });

        expect(obj.arr.join()).to.eq('2,3');
        expect(res.arr.join()).to.eq('2,3');
        expect(obj === res).to.be.true;
      });

      it('should immutably shift a value from the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&shift'] }, true);

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('2,3');
        expect(obj === res).to.be.false;
      });

      it('should mutably unshift a value to the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&unshift', 0] });

        expect(obj.arr.join()).to.eq('0,1,2,3');
        expect(res.arr.join()).to.eq('0,1,2,3');
        expect(obj === res).to.be.true;
      });

      it('should immutably unshift a value to the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&unshift', 0] }, true);

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('0,1,2,3');
        expect(obj === res).to.be.false;
      });

      it('should mutably slice the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&slice', [0, 1]] });

        expect(obj.arr.join()).to.eq('1');
        expect(res.arr.join()).to.eq('1');
        expect(obj === res).to.be.true;
      });

      it('should immutably slice the array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&slice', [0, 1]] }, true);

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('1');
        expect(obj === res).to.be.false;
      });

      it('should mutably reverse an array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&reverse'] });

        expect(obj.arr.join()).to.eq('3,2,1');
        expect(res.arr.join()).to.eq('3,2,1');
        expect(obj === res).to.be.true;
      });

      it('should immutably reverse an array', () => {
        const obj = { arr: [1, 2, 3] };
        const res = deepr.merge(obj, { arr: ['&reverse'] }, true);

        expect(obj.arr.join()).to.eq('1,2,3');
        expect(res.arr.join()).to.eq('3,2,1');
        expect(obj === res).to.be.false;
      });
    });

    describe('mergePrimative', () => {
      it('should set primative values', () => {
        const result = deepr.merge({
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

        expect(result.truth).to.be.false;
        expect(result.integer).to.eq(2);
        expect(result.string).to.eq('next');
        expect(result.add).to.eq('key');
        expect(result.type).to.eq(1);
      });

      it('should add one to the value', () => {
        const result = deepr.merge({}, {
          counts: { up: '&+=1' }
        });
        expect(result.counts.up).to.eq(1);
      });

      it('should subtract one from the value', () => {
        const result = deepr.merge({ up: 0 }, { up: '&-=1' });
        expect(result.up).to.eq(-1);
      });

      it('should multiply the value by 5', () => {
        const result = deepr.merge({ up: 5 }, { up: '&*=5' });
        expect(result.up).to.eq(25);
      });

      it('should divide the value by 5', () => {
        const result = deepr.merge({ up: 25 }, { up: '&/=5' });
        expect(result.up).to.eq(5);
      });
    });
  });

  describe('validate', () => {
    it('should validate an object', () => {
      const result = deepr.validate({
        name: null,
        address: {
          street: '&delete',
        }
      }, {
        name: ['required'],
        address: {
          street: ['required', 'protected']
        }
      });
      expect(result.valid).to.be.false;
      expect(result.errors[0]).to.eq('name is required');
      expect(result.errors[1]).to.eq('address.street is protected');
    });
  });
});