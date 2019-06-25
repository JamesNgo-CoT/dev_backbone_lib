/* global BaseModel */

/* exported BaseCollection */
class BaseCollection extends Backbone.Collection {
  preinitialize(models, options = {}) {
    this.model = options.model || this.model;

    this.url = options.url || this.url;

    this.authModel = options.authModel || this.authModel;

    this.webStorage = options.webStorage || this.webStorage;
    this.webStorageKey = options.webStorageKey || this.webStorageKey;

    super.preinitialize(models, options);
  }

  model(attributes, options) {
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
    return _.result(Backbone, 'webStorage');
  }

  webStorageSync(method, model, options) {
    Backbone.webStorageSync(method, model, options);
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
