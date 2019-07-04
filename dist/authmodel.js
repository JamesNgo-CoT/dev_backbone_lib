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

/* global _ */

/* global BaseModel */

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


      this.idAttribute = options.idAttribute || 'sid'; // Custom property-factory override

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