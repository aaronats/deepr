# Deepr

Zero dependency, deep recursive object merge with built-in API for object mutations.

## Installation

```sh
npm install deepr --save
```

## Quickstart

```javascript
const deepr = require('deepr);

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

const result = deepr.merge(obj, {
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

/*
  result...
  {
    string: 'deepr',
    newkey: 'newvalue',
    object: {
      bool: false,
      nested: {
        number: 2
      }
    },
    array: ['A', 'B', 'C', 'D']
  }
*/
```

### Primatives

To update or set a primative, simply set the new value.

```javascript
const obj = {
  string: 'hello',
  bool: false,
  nested: {
    number: 1
  }
};

const result = deepr.merge(obj, {
  string: 'deepr',
  newkey: 'newvalue',
  bool: true,
  nested: {
    number: 2
  },
});

/*
  result...
  {
    string: 'deepr',
    newkey: 'newvalue',
    bool: true,
    nested: {
      number: 2
    }
  }
*/
```

### Objects

To overwrite an existing object use the ``&=`` operator to signal the change.

```javascript
const obj = {
  nested: {
    key: 'value'
  }
};

const result = deepr.merge(obj, {
  object: ['&=', { newkey: 'newvalue' }]
});

/*
  result...
  {
    object: {
      newkey: 'newvalue'
    }
  }
*/
```

#### Immutability

By default, Deepr will simply update the original object. To leave the original object untouched, simply pass the clone option as true.

```javascript
const obj = {
  string: 'hello',
  object: { key: 'value' },
  array: [1, 2, 3]
};

const result = deepr.merge(obj, {
  string: 'deepr',
  object: { key: 'newval' },
  array: ['&push', 4]
}, true);

/*
  obj...
  {
    string: 'hello',
    object: {
      key: 'value'
    },
    array: [ 1, 2, 3 ]
  }

  result...
  {
    string: 'deepr',
    object: {
      key: 'newvalue'
    },
    array: [ 1, 2, 3, 4 ]
  }
*/
```

### Arrays

To update an existing array use the ``&=`` operator to signal the change.

```javascript
const obj = {
  array: ['A', 'B', 'C']
};

const result = deepr.merge(obj, {
  array: ['&=', [1, 2, 3]]
});

/*
  result...
  {
    array: [1, 2, 3]
  }
*/
```

#### Array Functions

Deepr includes common array functions like, push, pop, shift, etc. To manipulate an existing array, use ``&<function>`` to signal a change.

```javascript
const obj = {
  push: ['A', 'B', 'C'],
  shift: ['A', 'B', 'C'],
  unshift: ['A', 'B', 'C'],
  concat: ['A', 'B', 'C'],
  reverse: ['A', 'B', 'C'],
  slice: ['A', 'B', 'C'],
  pop: ['A', 'B', 'C']
};

const result = deepr.merge(obj, {
  push: ['&push', 'D'],
  shift: ['&shift'],
  unshift: ['&unshift', 'Z'],
  concat: ['&concat', ['D', 'E']],
  reverse: ['&reverse'],
  slice: ['&splice', [0, 1]],
  pop: ['&pop'],
});

/*
  result...
  {
    push: [ 'A', 'B', 'C', 'D' ],
    shift: [ 'B', 'C' ],
    unshift: [ 'Z', 'A', 'B', 'C' ],
    concat: [ 'A', 'B', 'C', 'D', 'E' ],
    reverse: [ 'C', 'B' , 'A'],
    slice: [ 'A' ],
    pop: [ 'A', 'B' ]
  }
*/
```

### Delete

To delte a key from an object use ``&delete``.

```javascript
const obj = {
  object: { key: 'value' },
  primative: 'string'
};

const result = deepr.merge(obj, {
  object: { key: '&delete' },
  primative: '&delete'
});

/*
  result...
  {
    object: {}
  }
*/
```

### Setters

Set the value to null, empty object or empty array. Note that each original type was overwritten.

`` &=null `` set the value to null
`` &={} `` set the value to an empty object
`` &=[] `` set the value to an empty array

```javascript
const obj = {
  primative: 'string',
  object: { key: 'val' },
  array: [1, 2, 3]
};

const result = deepr.merge(obj, {
  primative: '&=[]',
  object: '&=null',
  array: '&={}'
});

/*
  result...
  {
    primative: [],
    object: null,
    array: {},
  }
*/
```
