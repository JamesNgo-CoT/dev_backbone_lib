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