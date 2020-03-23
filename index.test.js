beforeEach(() => {
  localStorage.clear();
  jest.resetModules();
  global.localStorageSetting = require('./index.js');
});

it('must set', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value');
  obj.name = 'value2';
  expect(obj.name).toBe('value2');
  expect(localStorage.getItem('name')).toBe('"value2"');
});

it('as a singleton', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value');
  expect(obj.name).toBe('value');
  obj.name = 'value2';

  const obj2 = {}
  localStorageSetting(obj2, 'name', 'value');
  expect(obj.name).toBe('value2');
  expect(obj2.name).toBe('value2');
});

it('as a pointer', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value');

  const obj2 = {}
  localStorageSetting(obj2, 'name', 'value');

  obj.name = 'value2';
  expect(obj2.name).toBe('value2');
});

describe('can be a', () => {
  it('number', () => {
    const obj = {};
    localStorageSetting(obj, 'name', 123, { type: Number });

    obj.name = '456'
    expect(obj.name).toStrictEqual(456);
  });

  it('boolean', () => {
    const obj = {};
    localStorageSetting(obj, 'name', true, { type: Boolean });

    obj.name = '';
    expect(obj.name).toStrictEqual(false);
  });

  it('array', () => {
    const obj = {};
    localStorageSetting(obj, 'name', [123, 456]);
    expect(obj.name).toEqual([123, 456]);

    obj.name = [1, 2, 3];
    expect(obj.name).toEqual([1, 2, 3]);
  });

  it('object', () => {
    const obj = {};
    localStorageSetting(obj, 'name', { a:'b', c:'d' });
    expect(obj.name).toEqual({ a:'b', c:'d' });

    obj.name = { a:1, b:2 };
    expect(obj.name).toEqual({ a:1, b:2 });
  });
});
