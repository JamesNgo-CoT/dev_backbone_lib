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

      _get(_getPrototypeOf(LoginDialogView.prototype), "render", this).call(this);

      this.dialog.classList.add('modal-md');
      this.headerTitleSpan.textContent = 'Login Dialog';
      this.loginFormView = new LoginFormView({
        model: this.model
      });
      console.log(this.loginFormView.el);
      this.loginFormView.on('success', function () {
        _this.close();
      });
      this.body.appendChild(this.loginFormView.el);
      var formViewRenderPromise = this.loginFormView.render();
      return formViewRenderPromise;
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