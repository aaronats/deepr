const { expect } = require('chai');
const deepr = require('../index');

describe('Examples', () => {
  describe('Quickstart', () => {
    it('should merge an object with multiple types', () => {
      const obj = {
        string: 'hello',
        object: {
          bool: true,
          nested: {
            number: 1,
            array: [1, 2, 3]
          }
        },
        array: ['A', 'B', 'C']
      };

      const res = deepr.merge(obj, {
        string: 'deepr',
        newkey: 'newvalue',
        object: {
          bool: false,
          nested: {
            number: '&+=1',
            array: '&delete'
          }
        },
        array: ['&push', 'D']
      });

      expect(res.string).to.eq('deepr');
      expect(res.newkey).to.eq('newvalue');
      expect(res.object.bool).to.be.false;
      expect(res.object.nested.number).eq(2);
      expect(res.object.nested.array).to.be.undefined;
      expect(res.array.length).to.eq(4);
      expect(res.array.join()).to.eq('A,B,C,D');
      expect(res.array[3]).to.eq('D');
    });
  });

  describe('Primatives', () => {
    it('should merge primative values', () => {
      const obj = {
        string: 'hello',
        bool: false,
        nested: {
          number: 1
        }
      };
      const res = deepr.merge(obj, {
        string: 'deepr',
        newkey: 'newvalue',
        bool: true,
        nested: {
          number: 2
        }
      });

      expect(res.bool).to.eq(true);
      expect(res.newkey).to.eq('newvalue');
      expect(res.string).to.eq('deepr');
      expect(res.nested.number).to.eq(2);
    });
  });

  describe('Objects', () => {
    it('should overwrite and existing object', () => {
      const obj = {
        nested: {
          key: 'value'
        }
      };
      const res = deepr.merge(obj, {
        object: ['&=', { newkey: 'newvalue' }]
      });

      expect(res.object.newkey).to.eq('newvalue');
    });

    it('should immutably merge the object', () => {
      const obj = {
        string: 'hello',
        object: { key: 'value' },
        array: [1, 2, 3]
      };
      const res = deepr.merge(obj, {
        string: 'deepr',
        object: { key: 'newvalue' },
        array: ['&push', 4]
      }, true);

      expect(obj.string).to.eq('hello');
      expect(obj.object.key).to.eq('value');
      expect(obj.array.join()).to.eq('1,2,3');
      expect(res.string).to.eq('deepr');
      expect(res.object.key).to.eq('newvalue');
      expect(res.array.join()).to.eq('1,2,3,4');
    });
  });

  describe('Arrays', () => {
    it('should set the value of an array', () => {
      const obj = {
        array: ['A', 'B', 'C']
      };
      const res = deepr.merge(obj, {
        array: ['&=', [1, 2, 3]]
      });

      expect(res.array.length).to.eq(3);
      expect(res.array[0]).to.eq(1);
    });

    it('should perform array manipulations', () => {
      const obj = {
        push: ['A', 'B', 'C'],
        shift: ['A', 'B', 'C'],
        unshift: ['A', 'B', 'C'],
        concat: ['A', 'B', 'C'],
        reverse: ['A', 'B', 'C'],
        slice: ['A', 'B', 'C'],
        pop: ['A', 'B', 'C']
      };
      const res = deepr.merge(obj, {
        push: ['&push', 'D'],
        shift: ['&shift'],
        unshift: ['&unshift', 'Z'],
        concat: ['&concat', ['D', 'E']],
        reverse: ['&reverse'],
        slice: ['&slice', [0, 1]],
        pop: ['&pop'],
      });

      expect(res.push.join()).to.eq('A,B,C,D');
      expect(res.shift.join()).to.eq('B,C');
      expect(res.unshift.join()).to.eq('Z,A,B,C');
      expect(res.concat.join()).to.eq('A,B,C,D,E');
      expect(res.reverse.join()).to.eq('C,B,A');
      expect(res.slice.join()).to.eq('A');
      expect(res.pop.join()).to.eq('A,B');
    });
  });

  describe('Delete', () => {
    it('should delete a key', () => {
      const obj = {
        object: { key: 'value' },
        primative: 'string'
      };
      const res = deepr.merge(obj, {
        object: { key: '&delete' },
        primative: '&delete'
      });

      expect(res.primative).to.be.undefined;
      expect(res.object.key).to.be.undefined;
    });
  });

  describe('Setters', () => {
    it('should overwrite each value', () => {
      const obj = {
        primative: 'string',
        object: { key: 'val' },
        array: [1, 2, 3]
      };
      const res = deepr.merge(obj, {
        primative: '&=[]',
        object: '&=null',
        array: '&={}'
      });

      expect(res.object).to.be.null;
      expect(res.array).to.be.an('object');
      expect(res.array).to.be.empty;
      expect(res.primative).to.be.an('array');
      expect(res.primative).to.be.empty;
    });
  });
});