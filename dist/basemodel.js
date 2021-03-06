"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global _ Backbone */

/* exported BaseModel */
var BaseModel =
/*#__PURE__*/
function (_Backbone$Model) {
  _inherits(BaseModel, _Backbone$Model);

  function BaseModel() {
    _classCallCheck(this, BaseModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseModel).apply(this, arguments));
  }

  _createClass(BaseModel, [{
    key: "preinitialize",
    value: function preinitialize(attributes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Backbone property-factory originally not passed by constructor
      this.urlRoot = options.urlRoot || this.urlRoot; // New property-factory override

      this.webStorage = options.webStorage || this.webStorage;
      this.webStorageKey = options.webStorageKey || this.webStorageKey;
      this.addAuthorization = options.addAuthorization || this.addAuthorization;
      this.authModel = options.authModel || this.authModel;

      _get(_getPrototypeOf(BaseModel.prototype), "preinitialize", this).call(this, attributes, options);
    }
  }, {
    key: "url",
    value: function url() {
      if (this.isNew()) {
        return typeof _get(_getPrototypeOf(BaseModel.prototype), "url", this) === 'function' ? _get(_getPrototypeOf(BaseModel.prototype), "url", this).call(this) : _get(_getPrototypeOf(BaseModel.prototype), "url", this);
      }

      var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url');

      var id = this.get(this.idAttribute);
      return "".concat(base.replace(/\/$/, ''), "('").concat(encodeURIComponent(id), "')");
    }
  }, {
    key: "webStorage",
    value: function webStorage() {
      return localStorage;
    }
  }, {
    key: "webStorageSync",
    value: function webStorageSync(method, model) {
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
    }
  }, {
    key: "webStorageParse",
    value: function webStorageParse(json, options) {
      return json;
    }
  }, {
    key: "webStorageFetch",
    value: function webStorageFetch(options) {
      this.webStorageSync('read', this, options);
    }
  }, {
    key: "webStorageSave",
    value: function webStorageSave(attributes, options) {
      if (attributes && !options.attrs) {
        options.attrs = attributes;
      }

      if (this.isNew()) {
        this.webStorageSync('create', this, options);
      } else {
        this.webStorageSync('update', this, options);
      }
    }
  }, {
    key: "webStorageDestroy",
    value: function webStorageDestroy(options) {
      this.webStorageSync('delete', this, options);
    }
  }, {
    key: "addAuthorization",
    value: function addAuthorization() {
      return false;
    }
  }]);

  return BaseModel;
}(Backbone.Model);