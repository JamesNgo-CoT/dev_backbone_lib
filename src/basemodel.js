/* global _ Backbone */

/* exported BaseModel */
class BaseModel extends Backbone.Model {
  preinitialize(attributes, options = {}) {
    this.urlRoot = options.urlRoot || this.urlRoot;

    this.authModel = options.authModel || this.authModel;

    this.webStorage = options.webStorage || this.webStorage;
    this.webStorageKey = options.webStorageKey || this.webStorageKey;

    this.idAttribute = options.idAttribute || 'id';

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
