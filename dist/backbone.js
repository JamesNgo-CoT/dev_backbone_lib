"use strict";

var _this = void 0;

/* global _ Backbone */

/* global ajax */
Backbone.ajax = ajax;

Backbone.sync = function (backboneSync) {
  return function (method, model) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    options.headers = options.headers || {};
    options.headers.Accept = options.headers.Accept || 'application/json; charset=utf-8';

    if (!options.headers.Authorization) {
      var authModel = _.result(options, 'authModel') || _.result(model, 'authModel');

      if (authModel && !authModel.isNew()) {
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

Backbone.webStorage = localStorage;

Backbone.webStorageSync = function (method, model) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var webStorage = _.result(options, 'webStorage') || _.result(model, 'webStorage');

  var webStorageKey = _.result(options, 'webStorageKey') || _.result(model, 'webStorageKey');

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
};