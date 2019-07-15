/* global _ Backbone ajax */

Backbone.ajax = ajax;

Backbone.authModel = null;

Backbone.sync = (backboneSync => ((method, model, options = {}) => {
  options.headers = options.headers || {};
  options.headers.Accept = options.headers.Accept || 'application/json; charset=utf-8';

  if (!options.headers.Authorization) {
    const authModel = _.result(Backbone, 'authModel');
    if (authModel && !authModel.isNew() && model.addAuthorization !== false) {
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
