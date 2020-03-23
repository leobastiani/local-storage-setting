const instances = {};

class LocalStorageSetting {
  constructor(name, defaultValue, config = {}) {
    if(instances[name]) {
      return instances[name];
    }

    this.name = name
    this.defaultValue = defaultValue
    this.config = config
    this.has = localStorage.hasOwnProperty(name)
    if(this.has) {
      this.value = this.fromJSON(localStorage.getItem(name));
    }

    instances[name] = this
  }

  get() {
    return this.has ? this.value : this.asValue(this.defaultValue);
  }

  set(value) {
    this.value = this.asValue(value);
    this.has = true;
    return localStorage.setItem(this.name, this.asJSON(this.value));
  }

  asValue(value) {
    if(this.config.type === Number) {
      return Number(value);
    }
    if(this.config.type === Boolean) {
      return Boolean(value);
    }
    return value;
  }

  asJSON(value) {
    return JSON.stringify(value);
  }

  fromJSON(value) {
    return JSON.parse(value);
  }
}

module.exports = (scope, name, defaultValue, config = {}) => {
  const localStorageSetting = new LocalStorageSetting(name, defaultValue, config);

  Object.defineProperty(scope, name, {
    get() {
      return localStorageSetting.get();
    },
    set(value) {
      return localStorageSetting.set(value);
    },
  })
};
