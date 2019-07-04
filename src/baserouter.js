/* global _ Backbone */

/* exported BaseRouter */
class BaseRouter extends Backbone.Router {
  preinitialize(options = {}) {

    // New property-factory override
    this.defaultFragment = options.defaultFragment || this.defaultFragment;

    // New property
    this.lastFragment = null;
    this.cleanupFunction = null;

    super.preinitialize(options);
  }

  routes() {
    return {
      ['home']() { },
      '*default': 'routeDefault'
    };
  }

  route(route, name, callback) {
    let oldCallback;
    if (typeof callback === 'function') {
      oldCallback = callback;
    } else if (typeof name === 'function') {
      oldCallback = name;
    } else if (typeof name === 'string' && typeof this[name] === 'function') {
      oldCallback = this[name];
    }

    if (typeof oldCallback === 'function' && oldCallback !== this.routeDefault) {
      const newCallback = function (...args) {
        this.lastFragment = Backbone.history.getFragment();
        return oldCallback.call(this, ...args);
      }

      if (typeof callback === 'function') {
        callback = newCallback;
      } else if (typeof name === 'function') {
        name = newCallback;
      } else if (typeof name === 'string' && typeof this[name] === 'function') {
        this[name] = newCallback;
      }
    }

    return super.route(route, name, callback);
  }

  execute(callback, args, name) {
    let cleanupFunctionReturnValue;

    if (typeof this.cleanupFunction === 'function') {
      cleanupFunctionReturnValue = this.cleanupFunction.call(this, name);
      if (cleanupFunctionReturnValue !== false) {
        this.cleanupFunction = null;
      }
    }

    if (typeof callback === 'function' && cleanupFunctionReturnValue !== false) {
      Promise.resolve()
        .then(() => {
          return callback.call(this, ...args);
        })
        .then((cleanupFunction) => {
          if (typeof cleanupFunction === 'function') {
            this.cleanupFunction = cleanupFunction;
          }
        });
    }

    if (cleanupFunctionReturnValue === false) {
      this.routeDefault();
    }
  }

  defaultFragment() {
    return 'home';
  }

  routeDefault() {
    if (typeof this.lastFragment === 'string') {
      this.navigate(this.lastFragment, { trigger: false, replace: true });
    } else {
      const defaultFragment = _.result(this, 'defaultFragment');
      if (typeof defaultFragment === 'string') {
        this.navigate(defaultFragment, { trigger: true });
      }
    }
  }
}
