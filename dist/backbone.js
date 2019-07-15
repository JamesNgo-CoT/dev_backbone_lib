"use strict";

var _this = void 0;

/* global _ Backbone ajax */
Backbone.ajax = ajax;
Backbone.authModel = null;

Backbone.sync = function (backboneSync) {
  return function (method, model) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    options.headers = options.headers || {};
    options.headers.Accept = options.headers.Accept || 'application/json; charset=utf-8';

    if (!options.headers.Authorization) {
      var authModel = _.result(Backbone, 'authModel');

      var addAuthorization = _.result(model, 'addAuthorization');

      if (authModel && !authModel.isNew() && addAuthorization !== false) {
        options.headers.Authorization = "AuthSession ".concat(authModel.get(authModel.idAttribute));
      }
    }

    if (method === 'create' || method === 'update' || method === 'patch') {
      options.contentType = options.contentType || 'application/json; charset=utf-8';

      if (!options.data) {
        var json = options.attrs || model.toJSON(options);
        delete json['@odata.context'];
        delete json['@odata.etag'];
        delete json['__CreatedOn'];
        delete json['__ModifiedOn'];
        delete json['__Owner'];
        var adjustSyncJson = options.adjustSyncJson || model.adjustSyncJson;

        if (adjustSyncJson) {
          json = adjustSyncJson(json);
        }

        options.data = JSON.stringify(json);
      }
    }

    return backboneSync.call(_this, method, model, options);
  };
}(Backbone.sync);