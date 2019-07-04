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
      // this.lastFocused = null;
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
        // this.lastFocused = document.activeElement;
        // console.log(this.lastFocused)
        this.el.querySelector('.modal-title span[tabindex="-1"]').focus();
      }), _defineProperty(_ref, 'hidden.bs.modal', function hiddenBsModal() {
        // console.log(this.lastFocused)
        // if (this.lastFocused) {
        //   this.lastFocused.focus();
        // }
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