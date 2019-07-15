/* global _ Backbone BaseModel */

/* exported BaseCollection */
class BaseCollection extends Backbone.Collection {
  preinitialize(models, options = {}) {

    // Backbone property-factory originally not passed by constructor
    this.model = options.model || this.model;
    this.url = options.url || this.url;

    // New property-factory override
    this.webStorage = options.webStorage || this.webStorage;
    this.webStorageKey = options.webStorageKey || this.webStorageKey;

    super.preinitialize(models, options);
  }

  model(attributes, options) {
    // NOTE Backbone.Collection does not use model function without a prototype
    return new BaseModel(attributes, options);
  }

  fetch(options) {
    if (options && options.query) {
      options.url = `${_.result(this, 'url')}?${options.query}`;
    }

    return super.fetch(options);
  }

  parse(response, options) {
    if (response && Array.isArray(response.value)) {
      response = response.value;
    }

    return super.parse(response, options);
  }

  webStorage() {
    return localStorage;
  }

  webStorageSync(method, model, options = {}) {
    const webStorage = _.result(options, 'webStorage') || _.result(model, 'webStorage');
    const webStorageKey = _.result(options, 'webStorageKey') || _.result(model, 'webStorageKey');

    switch (method) {
      case 'read':
        model.set(model.webStorageParse(JSON.parse(webStorage.getItem(webStorageKey))), options);
        break;

      case 'create':
      case 'update':
        webStorage.setItem(webStorageKey, JSON.stringify(options.attrs || model.toJSON(options)));
        break;

      case 'delete':
        webStorage.removeItem(webStorageKey);
        break;
    }
  }

  webStorageParse(json, options) {
    return json;
  }

  webStorageFetch(options) {
    this.webStorageSync('read', this, options);
  }

  webStorageSave(attributes, options) {
    if (attributes && !options.attrs) {
      options.attrs = attributes;
    }

    if (this.isNew()) {
      this.webStorageSync('create', this, options);
    } else {
      this.webStorageSync('update', this, options);
    }
  }

  webStorageDestroy(options) {
    this.webStorageSync('delete', this, options);
  }

  addAuthorization() {
    return false;
  }
}
