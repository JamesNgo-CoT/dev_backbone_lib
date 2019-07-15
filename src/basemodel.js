/* global _ Backbone */

/* exported BaseModel */
class BaseModel extends Backbone.Model {
  preinitialize(attributes, options = {}) {

    // Backbone property-factory originally not passed by constructor
    this.urlRoot = options.urlRoot || this.urlRoot;

    // New property-factory override
    this.webStorage = options.webStorage || this.webStorage;
    this.webStorageKey = options.webStorageKey || this.webStorageKey;

    super.preinitialize(attributes, options);
  }

  url() {
    if (this.isNew()) {
      return typeof super.url === 'function' ? super.url() : super.url;
    }

    const base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');
    const id = this.get(this.idAttribute);
    return `${base.replace(/\/$/, '')}('${encodeURIComponent(id)}')`;
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
}
