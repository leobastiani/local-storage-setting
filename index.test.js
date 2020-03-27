let localStorageSetting

beforeEach(() => {
  localStorage.clear()
  jest.resetModules()
  localStorageSetting = require('./index.js')
})

it('must set', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value')
  obj.name = 'value2'
  expect(obj.name).toBe('value2')
  expect(localStorage.getItem('name')).toBe('"value2"')
})

it('as a singleton', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value')
  expect(obj.name).toBe('value')
  obj.name = 'value2'

  const obj2 = {}
  localStorageSetting(obj2, 'name', 'value')
  expect(obj.name).toBe('value2')
  expect(obj2.name).toBe('value2')
})

it('as a pointer', () => {
  const obj = {}
  localStorageSetting(obj, 'name', 'value')

  const obj2 = {}
  localStorageSetting(obj2, 'name', 'value')

  obj.name = 'value2'
  expect(obj2.name).toBe('value2')
})

describe('can be a', () => {
  it('number', () => {
    const obj = {}
    localStorageSetting(obj, 'name', 123, { type: Number })

    obj.name = '456'
    expect(obj.name).toStrictEqual(456)
  })

  it('boolean', () => {
    const obj = {}
    localStorageSetting(obj, 'name', true, { type: Boolean })

    obj.name = ''
    expect(obj.name).toStrictEqual(false)
  })

  it.each`
    comment
    ${'without default'}
    ${'with default'}
  `('array $comment', ({ comment }) => {
    const obj = {}
    if(comment == 'without default') {
      localStorageSetting(obj, 'name', [1, 2, 3], { type: Array })
    }
    else {
      localStorageSetting(obj, 'name', [], { type: Array })
      obj.name = [1, 2, 3]
      expect(localStorage.getItem('name')).toBe('[1,2,3]')
    }
    obj.name.push(4)
    expect(localStorage.getItem('name')).toBe('[1,2,3,4]')
    obj.name.unshift(0)
    expect(localStorage.getItem('name')).toBe('[0,1,2,3,4]')
    obj.name.pop()
    expect(localStorage.getItem('name')).toBe('[0,1,2,3]')
    obj.name.shift()
    expect(localStorage.getItem('name')).toBe('[1,2,3]')
    obj.name.splice(1, 1)
    expect(localStorage.getItem('name')).toBe('[1,3]')
  })

  it('object', () => {
    const obj = {}
    localStorageSetting(obj, 'name', { a: 'b', c: 'd' })
    expect(obj.name).toEqual({ a: 'b', c: 'd' })

    obj.name = { a: 1, b: 2 }
    expect(obj.name).toEqual({ a: 1, b: 2 })
    expect(localStorage.getItem('name')).toBe('{"a":1,"b":2}')

    localStorage.setItem('name2', localStorage.getItem('name'))
    localStorageSetting(obj, 'name2', { a: 'b', c: 'd' })
    expect(obj.name2).toEqual({ a: 1, b: 2 })
  })
})
