const instances = {}
const { appendToFunction } = require('function-extend')
const symbol = Symbol('LocalStorageSetting')

class LocalStorageSetting {
  constructor(name, defaultValue, config = {}) {
    if (instances[name]) {
      return instances[name]
    }

    this.name = name
    this.defaultValue = defaultValue
    this.config = config
    this.has = name in localStorage
    if (this.has) {
      this.value = this.fromJSON(localStorage.getItem(name))
    }

    this.bypassArray()

    instances[name] = this
  }

  get() {
    return this.has ? this.value : this.asValue(this.defaultValue)
  }

  set(value) {
    this.value = this.asValue(value)
    this.has = true
    this.bypassArray()
    localStorage.setItem(this.name, this.asJSON(this.value))
    return this.value
  }

  bypassArray() {
    if (this.config.type === Array) {
      const value = this.get();
      if (!value[symbol]) {
        const methods = ['pop', 'push', 'shift', 'splice', 'unshift']
        for (const method of methods) {
          appendToFunction(value, method, () => this.set(value));
        }
        value[this.symbol] = true;
      }
    }
  }

  asValue(value) {
    if (this.config.type === Number) {
      return Number(value)
    }
    if (this.config.type === Boolean) {
      return Boolean(value)
    }
    return value
  }

  asJSON(value) {
    return JSON.stringify(value)
  }

  fromJSON(value) {
    return JSON.parse(value)
  }
}

module.exports = (scope, name, defaultValue, config = {}) => {
  const localStorageSetting = new LocalStorageSetting(name, defaultValue, config)

  Object.defineProperty(scope, name, {
    get() {
      return localStorageSetting.get()
    },
    set(value) {
      return localStorageSetting.set(value)
    }
  })
}
