/* global _ Backbone */

/* global ajax */

Backbone.ajax = ajax;

Backbone.sync = (backboneSync => ((method, model, options = {}) => {
  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || 'application/json; charset=utf-8';

  if (!options.headers.Authorization) {
    const authModel = _.result(options, 'authModel') || _.result(model, 'authModel');
    if (authModel && !authModel.isNew()) {
      options.headers.Authorization = `AuthSession ${authModel.get(authModel.idAttribute)}`;
    }
  }

  if (method === 'create' || method === 'update' || method === 'patch') {
    options.contentType = options.contentType || 'application/json; charset=utf-8';

    if (!options.data) {
      let json = options.attrs || model.toJSON(options);

      delete json['@odata.context'];
      delete json['@odata.etag'];
      delete json['__CreatedOn'];
      delete json['__ModifiedOn'];
      delete json['__Owner'];

      const adjustSyncJson = options.adjustSyncJson || model.adjustSyncJson;
      if (adjustSyncJson) {
        json = adjustSyncJson(json);
      }

      options.data = JSON.stringify(json);
    }
  }

  return backboneSync.call(this, method, model, options);
}))(Backbone.sync);

Backbone.webStorage = localStorage;

Backbone.webStorageSync = (method, model, options = {}) => {
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
