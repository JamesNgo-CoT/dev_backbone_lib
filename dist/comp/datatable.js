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
    value: function reload() {
      if (this.datatable) {
        this.datatable.ajax.reload();
      }
    }
  }]);

  return DatatableView;
}(BaseView);