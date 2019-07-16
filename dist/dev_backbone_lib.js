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

/* global _ BaseModel */

/* exported AuthModel */
var AuthModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(AuthModel, _BaseModel);

  function AuthModel() {
    _classCallCheck(this, AuthModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(AuthModel).apply(this, arguments));
  }

  _createClass(AuthModel, [{
    key: "preinitialize",
    value: function preinitialize(attributes) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _get(_getPrototypeOf(AuthModel.prototype), "preinitialize", this).call(this, attributes, options); // Backbone property default value


      this.idAttribute = options.idAttribute || 'sid'; // New property-factory override

      this.app = options.app || this.app;
    }
  }, {
    key: "initialize",
    value: function initialize(attributes, options) {
      var _this = this;

      this.on("change:".concat(this.idAttribute), function () {
        if (!_this.isNew()) {
          _this.webStorageSave();
        } else {
          _this.webStorageDestroy();
        }
      });
      this.webStorageFetch();

      if (!this.isNew()) {
        this.fetch()["catch"](function () {
          _this.clear();
        });
      }

      _get(_getPrototypeOf(AuthModel.prototype), "initialize", this).call(this, attributes, options);
    }
  }, {
    key: "parse",
    value: function parse(response, options) {
      this.clear({
        silent: true
      });
      delete response['@odata.context'];
      delete response.pwd;
      return _get(_getPrototypeOf(AuthModel.prototype), "parse", this).call(this, response, options);
    }
  }, {
    key: "save",
    value: function save() {
      var attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _attributes$app = attributes.app,
          app = _attributes$app === void 0 ? _.result(this, 'app') : _attributes$app,
          _attributes$user = attributes.user,
          user = _attributes$user === void 0 ? this.get('user') : _attributes$user,
          _attributes$pwd = attributes.pwd,
          pwd = _attributes$pwd === void 0 ? this.get('pwd') : _attributes$pwd;
      this.clear({
        silent: true
      });
      return _get(_getPrototypeOf(AuthModel.prototype), "save", this).call(this, {
        app: app,
        user: user,
        pwd: pwd
      }, options);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _this2 = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      options.headers = options.headers || {};
      options.headers.Authorization = this.get('userID');
      return _get(_getPrototypeOf(AuthModel.prototype), "destroy", this).call(this, options)["finally"](function () {
        return _this2.clear();
      });
    }
  }, {
    key: "app",
    value: function app() {
      return 'cotapp';
    }
  }, {
    key: "login",
    value: function login(options) {
      return this.save(options);
    }
  }, {
    key: "logout",
    value: function logout() {
      return this.destroy();
    }
  }, {
    key: "isLoggedIn",
    value: function isLoggedIn() {
      return !this.isNew();
    }
  }, {
    key: "authentication",
    value: function authentication(options) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (!_this3.isLoggedIn()) {
          resolve(false);
        } else {
          _this3.fetch(options).then(function () {
            resolve(_this3.isLoggedIn());
          }, function (error) {
            reject(error);
          });
        }
      });
    }
  }]);

  return AuthModel;
}(BaseModel);
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
      var authModel = _.result(model, 'authModel') || _.result(Backbone, 'authModel');

      var addAuthorization = _.result(model, 'addAuthorization');

      if (authModel && !authModel.isNew() && addAuthorization) {
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

/* global _ Backbone BaseModel */

/* exported BaseCollection */
var BaseCollection =
/*#__PURE__*/
function (_Backbone$Collection) {
  _inherits(BaseCollection, _Backbone$Collection);

  function BaseCollection() {
    _classCallCheck(this, BaseCollection);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseCollection).apply(this, arguments));
  }

  _createClass(BaseCollection, [{
    key: "preinitialize",
    value: function preinitialize(models) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // Backbone property-factory originally not passed by constructor
      this.model = options.model || this.model;
      this.url = options.url || this.url; // New property-factory override

      this.webStorage = options.webStorage || this.webStorage;
      this.webStorageKey = options.webStorageKey || this.webStorageKey;
      this.addAuthorization = options.addAuthorization || this.addAuthorization;
      this.authModel = options.authModel || this.authModel;

      _get(_getPrototypeOf(BaseCollection.prototype), "preinitialize", this).call(this, models, options);
    }
  }, {
    key: "model",
    value: function model(attributes, options) {
      // NOTE Backbone.Collection does not use model function without a prototype
      return new BaseModel(attributes, options);
    }
  }, {
    key: "fetch",
    value: function fetch(options) {
      if (options && options.query) {
        options.url = "".concat(_.result(this, 'url'), "?").concat(options.query);
      }

      return _get(_getPrototypeOf(BaseCollection.prototype), "fetch", this).call(this, options);
    }
  }, {
    key: "parse",
    value: function parse(response, options) {
      if (response && Array.isArray(response.value)) {
        response = response.value;
      }

      return _get(_getPrototypeOf(BaseCollection.prototype), "parse", this).call(this, response, options);
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

  return BaseCollection;
}(Backbone.Collection);
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
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/* exported BaseRouter */
var BaseRouter =
/*#__PURE__*/
function (_Backbone$Router) {
  _inherits(BaseRouter, _Backbone$Router);

  function BaseRouter() {
    _classCallCheck(this, BaseRouter);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseRouter).apply(this, arguments));
  }

  _createClass(BaseRouter, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.defaultFragment = options.defaultFragment || this.defaultFragment; // New property

      this.lastFragment = null;
      this.cleanupFunction = null;

      _get(_getPrototypeOf(BaseRouter.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "routes",
    value: function routes() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, 'home', function home() {}), _defineProperty(_ref, '*default', 'routeDefault'), _ref;
    }
  }, {
    key: "route",
    value: function route(_route, name, callback) {
      var oldCallback;

      if (typeof callback === 'function') {
        oldCallback = callback;
      } else if (typeof name === 'function') {
        oldCallback = name;
      } else if (typeof name === 'string' && typeof this[name] === 'function') {
        oldCallback = this[name];
      }

      if (typeof oldCallback === 'function' && oldCallback !== this.routeDefault) {
        var newCallback = function newCallback() {
          var _oldCallback;

          this.lastFragment = Backbone.history.getFragment();

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return (_oldCallback = oldCallback).call.apply(_oldCallback, [this].concat(args));
        };

        if (typeof callback === 'function') {
          callback = newCallback;
        } else if (typeof name === 'function') {
          name = newCallback;
        } else if (typeof name === 'string' && typeof this[name] === 'function') {
          this[name] = newCallback;
        }
      }

      return _get(_getPrototypeOf(BaseRouter.prototype), "route", this).call(this, _route, name, callback);
    }
  }, {
    key: "execute",
    value: function execute(callback, args, name) {
      var _this = this;

      var cleanupFunctionReturnValue;

      if (typeof this.cleanupFunction === 'function') {
        cleanupFunctionReturnValue = this.cleanupFunction.call(this, name);

        if (cleanupFunctionReturnValue !== false) {
          this.cleanupFunction = null;
        }
      }

      if (typeof callback === 'function' && cleanupFunctionReturnValue !== false) {
        Promise.resolve().then(function () {
          return callback.call.apply(callback, [_this].concat(_toConsumableArray(args)));
        }).then(function (cleanupFunction) {
          if (typeof cleanupFunction === 'function') {
            _this.cleanupFunction = cleanupFunction;
          }
        });
      }

      if (cleanupFunctionReturnValue === false) {
        this.routeDefault();
      }
    }
  }, {
    key: "defaultFragment",
    value: function defaultFragment() {
      return 'home';
    }
  }, {
    key: "routeDefault",
    value: function routeDefault() {
      if (typeof this.lastFragment === 'string') {
        this.navigate(this.lastFragment, {
          trigger: false,
          replace: true
        });
      } else {
        var defaultFragment = _.result(this, 'defaultFragment');

        if (typeof defaultFragment === 'string') {
          this.navigate(defaultFragment, {
            trigger: true
          });
        }
      }
    }
  }]);

  return BaseRouter;
}(Backbone.Router);
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

/* global Backbone */

/* exported BaseView */
var BaseView =
/*#__PURE__*/
function (_Backbone$View) {
  _inherits(BaseView, _Backbone$View);

  function BaseView() {
    _classCallCheck(this, BaseView);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaseView).apply(this, arguments));
  }

  _createClass(BaseView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _get(_getPrototypeOf(BaseView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      var linkButton = this.el.querySelector('a.btn:not([role="button"])');

      while (linkButton) {
        linkButton.setAttribute('role', 'button');
        linkButton.addEventListener('keydown', function (event) {
          if (event.which === 32) {
            event.preventDefault();
            event.target.click();
          }
        });
        linkButton = this.el.querySelector('a.btn:not([role="button"])');
      }

      return Promise.resolve();
    }
  }]);

  return BaseView;
}(Backbone.View);
"use strict";

/* global ajax */
////////////////////////////////////////////////////////////////////////////////
// COT APP
////////////////////////////////////////////////////////////////////////////////
if (window.cot_app) {
  var originalRender = window.cot_app.prototype.render;

  window.cot_app.prototype.render = function () {
    this.titleElement = document.createElement('span');
    this.titleElement.setAttribute('tabindex', '-1');
    document.querySelector('#app-header h1').appendChild(this.titleElement);
    return originalRender.call(this);
  };

  window.cot_app.prototype.setTitle = function (title, subTitle) {
    if (this.titleElement == null) {
      return;
    }

    this.titleElement.innerHTML = title;
    var documentTitles = [this.name];

    if (documentTitles.indexOf(title) === -1) {
      documentTitles.unshift(title);
    }

    if (subTitle != null) {
      documentTitles.unshift(subTitle);
    }

    document.title = documentTitles.filter(function (title) {
      return title;
    }).join(' - ');
  };
} ////////////////////////////////////////////////////////////////////////////////
// COT FORM
////////////////////////////////////////////////////////////////////////////////


if (window.cot_form) {
  var originalAddformfield = window.cot_form.prototype.addformfield;

  window.cot_form.prototype.addformfield = function (fieldDefinition, fieldContainer) {
    originalAddformfield.call(this, fieldDefinition, fieldContainer);

    if (fieldDefinition['readOnly'] === true) {
      switch (fieldDefinition['type']) {
        case 'email':
        case 'number':
        case 'password':
        case 'text':
          fieldContainer.querySelector("[type=\"".concat(fieldDefinition['type'], "\"]")).setAttribute('readonly', '');
          break;

        case 'phone':
          fieldContainer.querySelector('[type="tel"]').setAttribute('readonly', '');
          break;

        case 'textarea':
          fieldContainer.querySelector('textarea').setAttribute('readonly', '');
          break;
      }
    }
  };

  var originalValidatorOptions = window.cot_form.prototype.validatorOptions;

  window.cot_form.prototype.validatorOptions = function (fieldDefinition) {
    var returnValue = originalValidatorOptions.call(this, fieldDefinition);

    if (fieldDefinition['excluded'] != null) {
      returnValue['excluded'] = fieldDefinition['excluded'];
    }

    return returnValue;
  };
} ////////////////////////////////////////////////////////////////////////////////
// COT FORM (MAIN)
////////////////////////////////////////////////////////////////////////////////


if (window.CotForm) {
  var _originalRender = window.CotForm.prototype.render;

  window.CotForm.prototype.render = function () {
    var _this2 = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    function renderLoop(_ref) {
      var definition = _ref.definition,
          renderSection = _ref.renderSection,
          renderRow = _ref.renderRow,
          renderField = _ref.renderField;
      var renderPromises = [];
      var sections = definition.sections;
      sections.forEach(function (section) {
        renderPromises.push(renderSection({
          definition: definition,
          section: section
        }));
        var rows = section.rows;
        rows.forEach(function (row) {
          renderPromises.push(renderRow({
            definition: definition,
            section: section,
            row: row
          }));
          var fields = row.fields;

          if (fields) {
            fields.forEach(function (field) {
              renderPromises.push(renderField({
                definition: definition,
                section: section,
                row: row,
                field: field
              }));
            });
          }

          var grid = row.grid;

          if (grid) {
            var _fields = grid.fields;

            _fields.forEach(function (field) {
              renderPromises.push(renderField({
                definition: definition,
                section: section,
                row: row,
                field: field,
                grid: grid
              }));
            });
          }

          var repeatControl = row.repeatControl;

          if (repeatControl) {
            var repeatControlRows = repeatControl.rows;
            repeatControlRows.forEach(function (repeatControlRow) {
              var fields = row.fields;
              fields.forEach(function (field) {
                renderPromises.push(renderField({
                  definition: definition,
                  section: section,
                  row: row,
                  field: field,
                  repeatControl: repeatControl,
                  repeatControlRow: repeatControlRow
                }));
              });
            });
          }
        });
      });
      return Promise.all(renderPromises);
    }

    function finalizeRenderer(renderer) {
      if (typeof renderer === 'function') {
        return renderer;
      } else if (typeof renderer === 'string') {
        if (renderer.indexOf('function(') === 0) {
          return Function("return ".concat(renderer))();
        } else if (typeof window[renderer] === 'function') {
          return window[renderer];
        }
      }
    }

    var cotForm = this;
    var model = cotForm.getModel();
    var view = cotForm.getView();
    var definition = this._definition;
    return Promise.resolve().then(function () {
      return renderLoop({
        definition: definition,
        renderSection: function renderSection(_ref2) {
          var definition = _ref2.definition,
              section = _ref2.section;
          var renderer = finalizeRenderer(section.preRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section
            });
          }
        },
        renderRow: function renderRow(_ref3) {
          var definition = _ref3.definition,
              section = _ref3.section,
              row = _ref3.row;
          var renderer = finalizeRenderer(row.preRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row
            });
          }
        },
        renderField: function renderField(_ref4) {
          var _this = this;

          var definition = _ref4.definition,
              section = _ref4.section,
              row = _ref4.row,
              field = _ref4.field,
              grid = _ref4.grid,
              repeatControl = _ref4.repeatControl,
              repeatControlRow = _ref4.repeatControlRow;
          return Promise.resolve().then(function () {
            if (typeof field.choices === 'string') {
              return ajax({
                url: field.choices
              }).then(function (data) {
                field.choices = data;
              });
            }
          }).then(function () {
            if (field.choices) {
              var value;

              if (field.value != null) {
                value = field.value;
              } else if (field.bindTo != null && model.has(field.bindTo)) {
                value = model.get(field.bindTo);
              }

              if (value != null) {
                var choices = field.choices.map(function (choice) {
                  return choice.value != null ? choice.value : choice.text;
                });

                if (choices.indexOf(value) === -1) {
                  field.choices.unshift({
                    text: value,
                    value: value
                  });
                }
              }
            }

            var renderer = finalizeRenderer(field.preRender);

            if (renderer) {
              return renderer.call(_this, {
                cotForm: cotForm,
                model: model,
                view: view,
                definition: definition,
                section: section,
                row: row,
                field: field,
                grid: grid,
                repeatControl: repeatControl,
                repeatControlRow: repeatControlRow
              });
            }
          });
        }
      });
    }).then(function () {
      return _originalRender.call.apply(_originalRender, [_this2].concat(args));
    }).then(function () {
      return renderLoop({
        definition: definition,
        renderSection: function renderSection(_ref5) {
          var definition = _ref5.definition,
              section = _ref5.section;
          var renderer = finalizeRenderer(section.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section
            });
          }
        },
        renderRow: function renderRow(_ref6) {
          var definition = _ref6.definition,
              section = _ref6.section,
              row = _ref6.row;
          var renderer = finalizeRenderer(row.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row
            });
          }
        },
        renderField: function renderField(_ref7) {
          var definition = _ref7.definition,
              section = _ref7.section,
              row = _ref7.row,
              field = _ref7.field,
              grid = _ref7.grid,
              repeatControl = _ref7.repeatControl,
              repeatControlRow = _ref7.repeatControlRow;
          var renderer = finalizeRenderer(field.postRender);

          if (renderer) {
            return renderer.call(this, {
              cotForm: cotForm,
              model: model,
              view: view,
              definition: definition,
              section: section,
              row: row,
              field: field,
              grid: grid,
              repeatControl: repeatControl,
              repeatControlRow: repeatControlRow
            });
          }
        }
      });
    });
  };

  window.CotForm.prototype.getModel = function () {
    return this._model;
  };

  window.CotForm.prototype.setView = function (view) {
    this._view = view;
  };

  window.CotForm.prototype.getView = function () {
    return this._view;
  };
}
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* global $ */

/* exported toQueryString */
function toQueryString(queryObject) {
  if (Array.isArray(queryObject)) {
    var array = [];

    for (var index = 0, length = queryObject.length; index < length; index++) {
      array.push(encodeURIComponent(toQueryString(queryObject[index])));
    }

    return array.join(',');
  }

  if (_typeof(queryObject) === 'object' && queryObject !== null) {
    var _array = [];

    for (var key in queryObject) {
      if (Object.prototype.hasOwnProperty.call(queryObject, key)) {
        _array.push("".concat(key, "=").concat(encodeURIComponent(toQueryString(queryObject[key]))));
      }
    }

    return _array.join('&');
  }

  var prefix = '';

  switch (_typeof(queryObject)) {
    case 'undefined':
      prefix = 'u';
      break;

    case 'boolean':
      prefix = 'b';
      break;

    case 'number':
      prefix = 'n';
      break;

    case 'function':
      prefix = 'f';
      break;

    case 'object':
      prefix = 'o';
      break;

    default:
      prefix = 's';
  }

  return "".concat(prefix).concat(String(queryObject));
}
/* exported toQueryObject */


function toQueryObject(queryString) {
  if (typeof queryString !== 'string') {
    return queryString;
  }

  if (queryString.indexOf(',') !== -1) {
    var array = queryString.split(',');

    for (var index = 0, length = array.length; index < length; index++) {
      array[index] = toQueryObject(decodeURIComponent(array[index]));
    }

    return array;
  }

  if (queryString.indexOf('=') !== -1) {
    var object = {};

    var _array2 = queryString.split('&');

    for (var _index = 0, _length = _array2.length; _index < _length; _index++) {
      var pair = _array2[_index].split('=');

      object[pair[0]] = toQueryObject(decodeURIComponent(pair[1]));
    }

    return object;
  }

  var prefix = queryString.charAt(0);
  var value = queryString.slice(1);

  switch (prefix) {
    case 'u':
      return undefined;

    case 'b':
      return Boolean(value);

    case 'n':
      return Number(value);

    case 'f':
      return new Function("return ".concat(value))();

    case 'o':
      return null;

    default:
      return value;
  }
}
/* exported escapeODataValue */


function escapeODataValue(str) {
  return str.replace(/'/g, "''").replace(/%/g, "%25").replace(/\+/g, "%2B").replace(/\//g, "%2F").replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/&/g, "%26").replace(/\[/g, "%5B").replace(/\]/g, "%5D").replace(/\s/g, "%20");
}
/* exported swapView */


function swapView(element, oldView, newView) {
  element.style.height = getComputedStyle(element).height;
  element.style.overflow = 'hidden';

  if (oldView) {
    oldView.remove();
  }

  Promise.resolve().then(function () {
    if (newView) {
      element.appendChild(newView.el);
      return newView.render();
    }
  }).then(function () {
    element.style.removeProperty('overflow');
    element.style.removeProperty('height');
  });
  return newView;
}
/* exported ajax */


function ajax(options) {
  return new Promise(function (resolve, reject) {
    $.ajax(options).then(function (data, textStatus, jqXHR) {
      resolve(data);
    }, function (jqXHR, textStatus, errorThrown) {
      reject(errorThrown);
    });
  });
}
/* exported el */


function el(tag, attrs, childEls, cbk) {
  // Create element.
  var element = document.createElement(tag); // Set attributes

  element._attrs = attrs;

  element.attr = function (name) {
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (this._attrs == null) {
      this._attrs = {};
    }

    if (this._attrs[name] !== value) {
      if (value === null) {
        delete this._attrs[name];
      } else {
        this._attrs[name] = value;
      }
    }

    if (typeof value === 'function') {
      value = value.call(this);
    }

    if (value === null) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value);
    }

    return this;
  };

  element.attrs = function (attrs) {
    if (this._attrs !== attrs) {
      this._attrs = attrs;
    }

    if (attrs != null) {
      for (var name in attrs) {
        var value = attrs[name];
        this.attr(name, value);
      }
    }

    return this;
  }; // Create children elements.


  element._childEls = childEls;

  element.childEls = function (childEls) {
    var _this = this;

    var reRender = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (this._childEls !== childEls) {
      this._childEls = childEls;
    }

    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    if (childEls !== null) {
      var fromFunction = false;

      if (typeof childEls === 'function') {
        childEls = childEls.call(this);
        fromFunction = true;
      }

      if (!Array.isArray(childEls)) {
        childEls = [childEls];
      }

      var fragment = document.createDocumentFragment();
      childEls.forEach(function (child) {
        var fromFunction2 = false;

        if (typeof child === 'function') {
          child = child.call(_this);
          fromFunction2 = true;
        }

        if (child instanceof HTMLElement) {
          fragment.appendChild(child);

          if (reRender && !fromFunction && !fromFunction2 && child.render != null) {
            child.render(true);
          }
        } else {
          fragment.appendChild(document.createTextNode(String(child)));
        }
      });
      this.appendChild(fragment);
    }

    return this;
  };

  element._cbk = cbk;

  element.cbk = function (cbk) {
    if (this._cbk !== cbk) {
      this._cbk = cbk;
    }

    if (cbk != null) {
      cbk.call(this, this);
    }

    return this;
  };

  element.render = function () {
    var reRender = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    this.attrs(this._attrs);
    this.childEls(this._childEls, reRender);
    this.cbk(this._cbk);
    return this;
  };

  return element.render(false);
}

['a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'comment', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].forEach(function (tag) {
  return el[tag] = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return el.apply(void 0, [tag].concat(args));
  };
});
"use strict";

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global BaseModel BaseView */

/* exported AlertModel */
var AlertModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(AlertModel, _BaseModel);

  function AlertModel() {
    _classCallCheck(this, AlertModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(AlertModel).apply(this, arguments));
  }

  _createClass(AlertModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        message: 'MESSAGE'
      };
    }
  }]);

  return AlertModel;
}(BaseModel);
/* exported AlertView */


var AlertView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(AlertView, _BaseView);

  function AlertView() {
    _classCallCheck(this, AlertView);

    return _possibleConstructorReturn(this, _getPrototypeOf(AlertView).apply(this, arguments));
  }

  _createClass(AlertView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(AlertView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "className",
    value: function className() {
      return 'alert-danger';
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        role: 'alert'
      };
    }
  }, {
    key: "render",
    value: function render() {
      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      this.el.classList.add('alert', 'alert-dismissible');
      var messageElementButton = this.el.appendChild(document.createElement('button'));
      messageElementButton.classList.add('close');
      messageElementButton.setAttribute('type', 'button');
      messageElementButton.setAttribute('data-dismiss', 'alert');
      messageElementButton.setAttribute('aria-label', 'Close');
      var messageElementButtonTimes = messageElementButton.appendChild(document.createElement('span'));
      messageElementButtonTimes.setAttribute('aria-hidden', 'true');
      messageElementButtonTimes.innerHTML = '&times;';
      var innerMessageElement = this.el.appendChild(document.createElement('div'));
      var message = this.model.get('message');

      if (typeof message === 'string') {
        innerMessageElement.innerHTML = message;
      } else {
        innerMessageElement.appendChild(message);
      }

      return _get(_getPrototypeOf(AlertView.prototype), "render", this).call(this);
    }
  }, {
    key: "close",
    value: function close() {
      this.el.querySelector('button[data-dismiss="alert"]').click();
    }
  }]);

  return AlertView;
}(BaseView);
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

/* global $ _ Backbone escapeODataValue BaseView */

/* exported DatatableView */
var DatatableView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(DatatableView, _BaseView);

  function DatatableView() {
    _classCallCheck(this, DatatableView);

    return _possibleConstructorReturn(this, _getPrototypeOf(DatatableView).apply(this, arguments));
  }

  _createClass(DatatableView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.datatableDefinition = options.datatableDefinition || this.datatableDefinition;
      this.dom = options.dom || this.dom;
      this.webstorage = options.webstorage || this.webstorage;
      this.webstorageKey = options.webstorageKey || this.webstorageKey;
      this.stateSave = options.stateSave || this.stateSave;
      this.stateSaveCallback = options.stateSaveCallback || this.stateSaveCallback;
      this.stateLoadCallback = options.stateLoadCallback || this.stateLoadCallback;
      this.table = options.table || this.table; // New property

      this.datatable = null;

      _get(_getPrototypeOf(DatatableView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "removeDatatable",
    value: function removeDatatable() {
      if (this.datatable) {
        this.datatable.destroy();
        this.datatable = null;
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeDatatable();

      _get(_getPrototypeOf(DatatableView.prototype), "remove", this).call(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      this.removeDatatable();

      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var table = _.result(this, 'table');

      this.el.appendChild(table);

      var datatableDefinition = _.result(this, 'datatableDefinition');

      datatableDefinition.dom = _.result(datatableDefinition, 'dom') || _.result(this, 'dom');
      datatableDefinition.stateSave = _.result(datatableDefinition, 'stateSave') || _.result(this, 'stateSave');

      datatableDefinition.stateSaveCallback = datatableDefinition.stateSaveCallback || function () {
        return _this.stateSaveCallback.apply(_this, arguments);
      };

      datatableDefinition.stateLoadCallback = datatableDefinition.stateLoadCallback || function () {
        return _this.stateLoadCallback.apply(_this, arguments);
      };

      datatableDefinition.ajax = datatableDefinition.ajax || function () {
        return _this.ajax.apply(_this, arguments);
      };

      datatableDefinition.initComplete = datatableDefinition.initComplete || function () {
        return _this.initComplete.apply(_this, arguments);
      };

      this.datatable = $(table).DataTable(datatableDefinition);
      return _get(_getPrototypeOf(DatatableView.prototype), "render", this).call(this);
    }
  }, {
    key: "webStorage",
    value: function webStorage() {
      return _.result(this.collection, 'webStorage') || _.result(Backbone, 'webStorage');
    }
  }, {
    key: "datatableDefinition",
    value: function datatableDefinition() {
      return {
        columns: [{
          title: 'Column 1',
          data: 'col1'
        }, {
          title: 'Column 2',
          data: 'col2'
        }, {
          title: 'Column 3',
          data: 'col3'
        }, {
          width: 100,
          render: function render() {
            return '<a href="#" class="btn btn-default">View</a>';
          }
        }],
        data: [{
          col1: 'Data (1, 1)',
          col2: 'Data (1, 2)',
          col3: 'Data (1, 3)'
        }, {
          col1: 'Data (1, 2)',
          col2: 'Data (2, 2)',
          col3: 'Data (3, 3)'
        }, {
          col1: 'Data (1, 3)',
          col2: 'Data (2, 3)',
          col3: 'Data (3, 3)'
        }]
      };
    }
  }, {
    key: "dom",
    value: function dom() {
      return "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'<'table-responsive'tr>>><'row'<'col-sm-5'i><'col-sm-7'p>>B";
    }
  }, {
    key: "stateSave",
    value: function stateSave() {
      return false;
    }
  }, {
    key: "stateSaveCallback",
    value: function stateSaveCallback(settings, data) {
      var webStorage = _.result(this, 'webStorage') || _.result(this.collection, 'webStorage');

      var webstorageKey = _.result(this, 'webstorageKey') || _.result(this.collection, 'webstorageKey');

      webStorage.setItem(webstorageKey, JSON.stringify(data));
    }
  }, {
    key: "stateLoadCallback",
    value: function stateLoadCallback(settings) {
      var webStorage = _.result(this, 'webStorage') || _.result(this.collection, 'webStorage');

      var webstorageKey = _.result(this, 'webstorageKey') || _.result(this.collection, 'webstorageKey');

      try {
        return JSON.parse(webStorage.getItem(webstorageKey));
      } catch (error) {
        return;
      }
    }
  }, {
    key: "ajax",
    value: function ajax(data, callback, settings) {
      var _this2 = this;

      var serverSide = settings.oFeatures.bServerSide;

      if (serverSide) {
        var datatableDefinition = _.result(this, 'datatableDefinition');

        var columns = data.columns,
            draw = data.draw,
            length = data.length,
            order = data.order,
            search = data.search,
            start = data.start;
        var queryObject = {}; // $count

        queryObject['$count'] = true; // $select

        queryObject['$select'] = columns.filter(function (config) {
          return typeof config.data === 'string';
        }).map(function (config) {
          return config.data;
        }).filter(function (select, index, array) {
          return array.indexOf(select) === index;
        }).join(','); // $filter

        var filters = columns.map(function (column, index) {
          if (column.searchable && column.search && column.search.value) {
            if (datatableDefinition && datatableDefinition.columns && datatableDefinition.columns[index] && datatableDefinition.columns[index].filterType) {
              switch (datatableDefinition.columns[index].filterType) {
                case 'custom function':
                  return "(".concat(datatableDefinition.columns[index].filterFunction(column, datatableDefinition.columns[index]), ")");

                case 'string equals':
                  return "".concat(column.data, " eq '").concat(escapeODataValue(column.search.value), "'");

                case 'string contains':
                  return "(".concat(column.search.value.split(' ').filter(function (value, index, array) {
                    return value && array.indexOf(value) === index;
                  }).map(function (value) {
                    return "contains(tolower(".concat(column.data, "),'").concat(escapeODataValue(value.toLowerCase()), "')");
                  }).join(' and '), ")");
              }
            }

            return "".concat(column.data, " eq ").concat(escapeODataValue(column.search.value));
          } else {
            return false;
          }
        }).filter(function (value) {
          return value;
        });

        if (filters.length > 0) {
          queryObject['$filter'] = filters.join(' and ');
        } // $orderby


        if (order.length > 0) {
          queryObject['$orderby'] = order.map(function (config) {
            var orderBy = columns[config.column].data;

            if (datatableDefinition && datatableDefinition.columns && datatableDefinition.columns[config.column] && datatableDefinition.columns[config.column].orderType) {
              switch (datatableDefinition.columns[config.column].orderType) {
                case 'custom function':
                  return datatableDefinition.columns[config.column].orderType ? datatableDefinition.columns[config.column].orderType(config, orderBy, datatableDefinition.columns[config.column]) : null;

                case 'string':
                  return "tolower(".concat(orderBy, ") ").concat(config.dir);
              }
            }

            return "".concat(orderBy, " ").concat(config.dir);
          }).filter(function (value) {
            return value;
          }).join(',');
        } // $search


        if (search && search.value) {
          queryObject['$search'] = search.value;
        } // $skip


        queryObject['$skip'] = start; // $top

        queryObject['$top'] = length;
        var queryArray = [];

        for (var key in queryObject) {
          queryArray.push("".concat(key, "=").concat(queryObject[key]));
        }

        this.collection.fetch({
          query: queryArray.join('&')
        }).then(function (data) {
          callback({
            data: _this2.collection.toJSON(),
            draw: draw,
            recordsTotal: data['@odata.count'],
            recordsFiltered: data['@odata.count']
          });
        }, function () {
          callback({
            data: [],
            draw: draw,
            recordsTotal: 0,
            recordsFiltered: 0
          });
        });
      }
    }
  }, {
    key: "initComplete",
    value: function initComplete(settings, json) {}
  }, {
    key: "table",
    value: function table() {
      var newTable = document.createElement('table');
      newTable.classList.add('table', 'table-bordered');
      newTable.style.width = '100%';
      return newTable;
    }
  }, {
    key: "reload",
    value: function reload(callback, resetPaging) {
      if (this.datatable) {
        this.datatable.ajax.reload(callback, resetPaging);
      }
    }
  }]);

  return DatatableView;
}(BaseView);
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global BaseModel BaseView */

/* exported DialogModel */
var DialogModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(DialogModel, _BaseModel);

  function DialogModel() {
    _classCallCheck(this, DialogModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(DialogModel).apply(this, arguments));
  }

  _createClass(DialogModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        id: '',
        size: 'lg',
        heading: 'HEADING',
        body: 'BODY',
        footer: '<button class="btn btn-primary" data-dismiss="modal">Close</button>'
      };
    }
  }]);

  return DialogModel;
}(BaseModel);
/* exported DialogView */


var DialogView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(DialogView, _BaseView);

  function DialogView() {
    _classCallCheck(this, DialogView);

    return _possibleConstructorReturn(this, _getPrototypeOf(DialogView).apply(this, arguments));
  }

  _createClass(DialogView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New properties
      this.dialog = null;
      this.headerTitleSpan = null;
      this.body = null;
      this.footer = null;

      _get(_getPrototypeOf(DialogView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(DialogView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "className",
    value: function className() {
      return 'modal fade';
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        tabindex: '-1',
        role: 'dialog',
        'aria-hidden': 'true',
        'aria-modal': 'true'
      };
    }
  }, {
    key: "events",
    value: function events() {
      var _ref;

      return _ref = {}, _defineProperty(_ref, 'shown.bs.modal', function shownBsModal() {
        this.el.querySelector('.modal-title span[tabindex="-1"]').focus();
      }), _defineProperty(_ref, 'hidden.bs.modal', function hiddenBsModal() {
        this.trigger('hidden.bs.modal');
      }), _ref;
    }
  }, {
    key: "render",
    value: function render() {
      while (this.el.firstChild) {
        this.el.removeChild(this.el.firstChild);
      }

      this.el.setAttribute('aria-labelledby', "".concat(this.id, "_title"));
      this.dialog = this.el.appendChild(document.createElement('div'));
      this.dialog.classList.add('modal-dialog');

      if (this.model.has('size')) {
        this.dialog.classList.add("modal-".concat(this.model.get('size')));
      }

      this.dialog.setAttribute('role', 'document');
      var content = this.dialog.appendChild(document.createElement('div'));
      content.classList.add('modal-content');
      var header = content.appendChild(document.createElement('div'));
      header.classList.add('modal-header');
      var headerButton = header.appendChild(document.createElement('button'));
      headerButton.classList.add('close');
      headerButton.setAttribute('type', 'button');
      headerButton.setAttribute('aria-label', 'Close');
      headerButton.setAttribute('data-dismiss', 'modal');
      headerButton.innerHTML = '<span aria-hidden="true">&times;</span>';
      var headerTitle = header.appendChild(document.createElement('div'));
      headerTitle.classList.add('modal-title');
      headerTitle.setAttribute('id', "".concat(this.id, "_title"));
      headerTitle.setAttribute('role', 'heading');
      headerTitle.setAttribute('aria-level', '2');
      this.headerTitleSpan = headerTitle.appendChild(document.createElement('span'));
      this.headerTitleSpan.setAttribute('tabindex', '-1');
      var headingContent = this.model.get('heading');

      if (typeof headingContent === 'string') {
        this.headerTitleSpan.innerHTML = headingContent;
      } else if (headingContent instanceof HTMLElement) {
        this.headerTitleSpan.appendChild(headingContent);
      }

      this.body = content.appendChild(document.createElement('div'));
      this.body.classList.add('modal-body');
      var bodyContent = this.model.get('body');

      if (typeof bodyContent === 'string') {
        this.body.innerHTML = bodyContent;
      } else if (bodyContent instanceof HTMLElement) {
        this.body.appendChild(bodyContent);
      }

      this.footer = content.appendChild(document.createElement('div'));
      this.footer.classList.add('modal-footer');
      var footerContent = this.model.get('footer');

      if (typeof footerContent === 'string') {
        this.footer.innerHTML = footerContent;
      } else if (footerContent instanceof HTMLElement) {
        this.footer.appendChild(footerContent);
      }

      return _get(_getPrototypeOf(DialogView.prototype), "render", this).call(this);
    }
  }, {
    key: "open",
    value: function open() {
      this.$el.modal('show');
    }
  }, {
    key: "close",
    value: function close() {
      this.$el.modal('hide');
    }
  }], [{
    key: "singleton",
    get: function get() {
      if (!DialogView._singleton) {
        DialogView._singleton = new DialogView(DialogView.singletonOptions);

        if (DialogView.singletonParent) {
          DialogView.singletonParent.appendChild(DialogView._singleton.el);

          DialogView._singleton.render();
        }
      }

      return DialogView._singleton;
    }
  }, {
    key: "singletonParent",
    get: function get() {
      return DialogView._singletonParent;
    },
    set: function set(value) {
      DialogView._singletonParent = value;
    }
  }, {
    key: "singletonOptions",
    get: function get() {
      return DialogView._singletonOptions;
    },
    set: function set(value) {
      DialogView._singletonOptions = value;
    }
  }]);

  return DialogView;
}(BaseView);
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

/* global $ _ CotForm BaseView AlertModel AlertView */

/* exported FormView */
var FormView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(FormView, _BaseView);

  function FormView() {
    _classCallCheck(this, FormView);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormView).apply(this, arguments));
  }

  _createClass(FormView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.formDefinition = options.formDefinition || this.formDefinition;
      this.rootPath = options.rootPath || this.rootPath;
      this.success = options.success || this.success; // New properties

      this.cotForm = null;
      this.form = null;
      this.formValidator = null;

      _get(_getPrototypeOf(FormView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var formDefinition = _.result(this, 'formDefinition');

      formDefinition.id = _.result(formDefinition, 'id') || FormView.uniqueId;
      formDefinition.rootPath = _.result(formDefinition, 'rootPath') || _.result(this, 'rootPath');
      formDefinition.useBinding = true;

      formDefinition.success = formDefinition.success || function (event) {
        event.preventDefault();

        _this.success();

        return false;
      };

      this.cotForm = new CotForm(formDefinition);
      this.cotForm.setModel(this.model);
      this.cotForm.setView(this);
      return Promise.resolve().then(function () {
        return _this.cotForm.render({
          target: _this.el
        });
      }).then(function () {
        _this.form = _this.el.querySelector('form');
        _this.formValidator = $(_this.form).data('formValidation');
        return _get(_getPrototypeOf(FormView.prototype), "render", _this).call(_this, _this);
      });
    }
  }, {
    key: "success",
    value: function success() {
      this.trigger('success');
    }
  }, {
    key: "showAlert",
    value: function showAlert(message, sectionIndex) {
      var parentNode = this.form;

      if (sectionIndex != null) {
        parentNode = parentNode.querySelectorAll('.panel-body')[sectionIndex];
      }

      var model = new AlertModel({
        message: message
      });
      var alertView = new AlertView({
        model: model
      });
      parentNode.insertBefore(alertView.el, parentNode.firstChild);
      alertView.render();
    }
  }], [{
    key: "uniqueId",
    get: function get() {
      if (FormView._uniqueId == null) {
        FormView._uniqueId = 0;
      }

      return "FormView_".concat(FormView._uniqueId++);
    }
  }]);

  return FormView;
}(BaseView);
"use strict";

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global BaseModel BaseView */

/* exported HighlightedModel */
var HighlightedModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(HighlightedModel, _BaseModel);

  function HighlightedModel() {
    _classCallCheck(this, HighlightedModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(HighlightedModel).apply(this, arguments));
  }

  _createClass(HighlightedModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        content: 'HIGHLIGHTED CONTENT'
      };
    }
  }]);

  return HighlightedModel;
}(BaseModel);
/* exported HighlightedView */


var HighlightedView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(HighlightedView, _BaseView);

  function HighlightedView() {
    _classCallCheck(this, HighlightedView);

    return _possibleConstructorReturn(this, _getPrototypeOf(HighlightedView).apply(this, arguments));
  }

  _createClass(HighlightedView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(HighlightedView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var content = this.model.get('content');

      if (typeof content === 'string') {
        this.el.innerHTML = content;
      } else {
        this.el.appendChild(content);
      }

      return _get(_getPrototypeOf(HighlightedView.prototype), "render", this).call(this);
    }
  }]);

  return HighlightedView;
}(BaseView);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/* global _ Backbone toQueryString BaseView */

/* exported LoginButtonView */
var LoginButtonView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(LoginButtonView, _BaseView);

  function LoginButtonView() {
    _classCallCheck(this, LoginButtonView);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoginButtonView).apply(this, arguments));
  }

  _createClass(LoginButtonView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.loginFragment = options.loginFragment || this.loginFragment;

      _get(_getPrototypeOf(LoginButtonView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(LoginButtonView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "events",
    value: function events() {
      return _defineProperty({}, 'click button', function clickButton() {
        var _this2 = this;

        this.afterRenderOnce = function () {
          _this2.el.querySelector('a').focus();
        };

        this.model.logout();
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.model.isLoggedIn()) {
        var cotUser = this.model.get('cotUser');
        var name = cotUser ? [cotUser.lastName, cotUser.firstName].filter(function (str) {
          return str;
        }).join(', ') : this.model.get('userID');
        this.el.innerHTML = "<button type=\"button\" class=\"btn btn-default\">Logout: <strong>".concat(name, "</strong></button>");
      } else {
        var fullLoginFragment = _.result(this, 'fullLoginFragment');

        this.el.innerHTML = "<a href=\"#".concat(fullLoginFragment, "\" class=\"btn btn-default\">Login</a>");
      }

      return _get(_getPrototypeOf(LoginButtonView.prototype), "render", this).call(this);
    }
  }, {
    key: "fullLoginFragment",
    value: function fullLoginFragment() {
      var loginFragment = _.result(this, 'loginFragment');

      var query = Backbone.History.started ? "?".concat(toQueryString({
        redirect: Backbone.history.getFragment()
      })) : '';
      return "".concat(loginFragment).concat(query);
    }
  }, {
    key: "hide",
    value: function hide() {
      this.el.classList.add('hide');
    }
  }, {
    key: "show",
    value: function show() {
      this.el.classList.remove('hide');
    }
  }]);

  return LoginButtonView;
}(BaseView);
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

/* global DialogView LoginFormView */

/* exported LoginDialogView */
var LoginDialogView =
/*#__PURE__*/
function (_DialogView) {
  _inherits(LoginDialogView, _DialogView);

  function LoginDialogView() {
    _classCallCheck(this, LoginDialogView);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoginDialogView).apply(this, arguments));
  }

  _createClass(LoginDialogView, [{
    key: "initialize",
    value: function initialize(options) {}
  }, {
    key: "removeLoginFormView",
    value: function removeLoginFormView() {
      if (this.loginFormView) {
        this.loginFormView.remove();
        this.loginFormView = null;
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeLoginFormView();

      _get(_getPrototypeOf(LoginDialogView.prototype), "remove", this).call(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      this.removeLoginFormView();
      return _get(_getPrototypeOf(LoginDialogView.prototype), "render", this).call(this).then(function () {
        _this.dialog.classList.add('modal-md');

        _this.headerTitleSpan.textContent = 'Login Dialog';
        _this.loginFormView = new LoginFormView({
          model: _this.model
        });

        _this.loginFormView.on('success', function () {
          _this.close();
        });

        _this.body.appendChild(_this.loginFormView.el);

        return _this.loginFormView.render();
      });
    }
  }], [{
    key: "singleton",
    get: function get() {
      if (!LoginDialogView._singleton) {
        LoginDialogView._singleton = new LoginDialogView(LoginDialogView.singletonOptions);

        if (LoginDialogView.singletonParent) {
          LoginDialogView.singletonParent.appendChild(LoginDialogView._singleton.el);

          LoginDialogView._singleton.render();
        }
      }

      return LoginDialogView._singleton;
    }
  }]);

  return LoginDialogView;
}(DialogView);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

/* global FormView */

/* exported LoginFormView */
var LoginFormView =
/*#__PURE__*/
function (_FormView) {
  _inherits(LoginFormView, _FormView);

  function LoginFormView() {
    _classCallCheck(this, LoginFormView);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoginFormView).apply(this, arguments));
  }

  _createClass(LoginFormView, [{
    key: "formDefinition",
    value: function formDefinition() {
      return {
        sections: [{
          title: 'Login',
          rows: [{
            fields: [{
              type: 'html',
              html: 'Login using your City of Toronto username and password.'
            }]
          }, {
            fields: [{
              title: 'User Name',
              required: true,
              bindTo: 'user'
            }]
          }, {
            fields: [{
              title: 'Password',
              type: 'password',
              required: true,
              bindTo: 'pwd'
            }]
          }, {
            fields: [{
              title: 'Login',
              type: 'button',
              btnClass: 'primary btn-login'
            }]
          }, {
            fields: [{
              type: 'html',
              html: 'Need help logging in? Contact <a href="mailto:itservice@toronto.ca">IT Service Desk</a> or all 416-338-2255'
            }]
          }]
        }]
      };
    }
  }, {
    key: "events",
    value: function events() {
      return _defineProperty({}, 'click .btn-login', function clickBtnLogin() {
        this.el.querySelector('.fv-hidden-submit').click();
      });
    }
  }, {
    key: "success",
    value: function success() {
      var _this = this;

      var button = this.el.querySelector('.btn-login');
      button.setAttribute('disabled', '');
      var buttonText = button.querySelectorAll('span')[1];
      buttonText.textContent = 'Verifying information';
      this.model.login().then(function () {
        _get(_getPrototypeOf(LoginFormView.prototype), "success", _this).call(_this);
      }, function (error) {
        _this.showAlert('<strong>Login failed.</strong> Please review your user name and password and try again.', 0);
      }).then(function () {
        _this.formValidator.resetForm();

        buttonText.textContent = 'Login';
        button.removeAttribute('disabled');
      });
    }
  }]);

  return LoginFormView;
}(FormView);
"use strict";

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* global _ Backbone BaseModel BaseCollection BaseView */

/* exported NavItemModel */
var NavItemModel =
/*#__PURE__*/
function (_BaseModel) {
  _inherits(NavItemModel, _BaseModel);

  function NavItemModel() {
    _classCallCheck(this, NavItemModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavItemModel).apply(this, arguments));
  }

  _createClass(NavItemModel, [{
    key: "defaults",
    value: function defaults() {
      return {
        title: 'Untitled',
        fragment: '',
        isActive: false,
        isVisible: true,
        requiresLogin: false
      };
    }
  }]);

  return NavItemModel;
}(BaseModel);
/* exported NavItemView */


var NavItemView =
/*#__PURE__*/
function (_BaseView) {
  _inherits(NavItemView, _BaseView);

  function NavItemView() {
    _classCallCheck(this, NavItemView);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavItemView).apply(this, arguments));
  }

  _createClass(NavItemView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this = this;

      this.listenTo(options.model, 'change', function () {
        _this.render();
      });

      _get(_getPrototypeOf(NavItemView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "tagName",
    value: function tagName() {
      return 'li';
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        role: 'presentation'
      };
    }
  }, {
    key: "render",
    value: function render() {
      this.el.innerHTML = "<a href=\"#".concat(this.model.escape('fragment'), "\">").concat(this.model.escape('title'), "</a>");

      if (this.model.get('isActive')) {
        this.el.classList.add('active');
      } else {
        this.el.classList.remove('active');
      }

      if (this.model.get('isVisible')) {
        this.el.classList.remove('hide');
      } else {
        this.el.classList.add('hide');
      }

      return _get(_getPrototypeOf(NavItemView.prototype), "render", this).call(this);
    }
  }]);

  return NavItemView;
}(BaseView);
/* exported AuthyNavItemView */


var AuthyNavItemView =
/*#__PURE__*/
function (_NavItemView) {
  _inherits(AuthyNavItemView, _NavItemView);

  function AuthyNavItemView() {
    _classCallCheck(this, AuthyNavItemView);

    return _possibleConstructorReturn(this, _getPrototypeOf(AuthyNavItemView).apply(this, arguments));
  }

  _createClass(AuthyNavItemView, [{
    key: "initialize",
    value: function initialize(options) {
      var _this2 = this;

      var authModel = _.result(Backbone, 'authModel');

      this.listenTo(authModel, 'change', function () {
        _this2.render();
      });
      return _get(_getPrototypeOf(AuthyNavItemView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "render",
    value: function render() {
      _get(_getPrototypeOf(AuthyNavItemView.prototype), "render", this).call(this);

      var authModel = _.result(Backbone, 'authModel');

      if (authModel && authModel.isLoggedIn()) {
        this.el.classList.remove('hide');
      } else {
        this.el.classList.add('hide');
      }
    }
  }]);

  return AuthyNavItemView;
}(NavItemView);
/* exported NavCollection */


var NavCollection =
/*#__PURE__*/
function (_BaseCollection) {
  _inherits(NavCollection, _BaseCollection);

  function NavCollection() {
    _classCallCheck(this, NavCollection);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavCollection).apply(this, arguments));
  }

  _createClass(NavCollection, [{
    key: "model",
    value: function model(attributes, options) {
      return new NavItemModel(attributes, options);
    }
  }, {
    key: "setActive",
    value: function setActive(index) {
      this.each(function (model, modelIndex) {
        if (index === modelIndex) {
          model.set('isActive', true);
        } else {
          model.set('isActive', false);
        }
      });
    }
  }]);

  return NavCollection;
}(BaseCollection);
/* exported NavView */


var NavView =
/*#__PURE__*/
function (_BaseView2) {
  _inherits(NavView, _BaseView2);

  function NavView() {
    _classCallCheck(this, NavView);

    return _possibleConstructorReturn(this, _getPrototypeOf(NavView).apply(this, arguments));
  }

  _createClass(NavView, [{
    key: "preinitialize",
    value: function preinitialize() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      // New property-factory override
      this.navItemView = options.navItemView || this.navItemView; // New property

      this.navItems = [];

      _get(_getPrototypeOf(NavView.prototype), "preinitialize", this).call(this, options);
    }
  }, {
    key: "initialize",
    value: function initialize(options) {
      var _this3 = this;

      this.listenTo(options.collection, 'update', function () {
        _this3.render();
      });

      _get(_getPrototypeOf(NavView.prototype), "initialize", this).call(this, options);
    }
  }, {
    key: "attributes",
    value: function attributes() {
      return {
        role: 'navigation'
      };
    }
  }, {
    key: "removeNavItems",
    value: function removeNavItems() {
      this.navItems.forEach(function (navItem) {
        return navItem.remove();
      });
      this.navItems = [];
    }
  }, {
    key: "remove",
    value: function remove() {
      this.removeNavItems();

      _get(_getPrototypeOf(NavView.prototype), "remove", this).call(this);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      this.removeNavItems();

      while (this.el.firstChild) {
        this.removeChild(this.el.firstChild);
      }

      var wrapper = this.el.appendChild(document.createElement('ul'));
      wrapper.classList.add('nav', 'nav-tabs');
      var navItemViewRenderPromises = [];
      this.collection.each(function (model) {
        var navItemView;

        if (model.get('requiresLogin')) {
          navItemView = new AuthyNavItemView({
            model: model
          });
        } else {
          navItemView = new NavItemView({
            model: model
          });
        }

        if (navItemView) {
          wrapper.appendChild(navItemView.el);
          navItemViewRenderPromises.push(navItemView.render());

          _this4.navItems.push(navItemView);
        }
      });
      return Promise.all(navItemViewRenderPromises).then(function () {
        return _get(_getPrototypeOf(NavView.prototype), "render", _this4).call(_this4);
      });
    }
  }]);

  return NavView;
}(BaseView);