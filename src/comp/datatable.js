/* global $ _ Backbone escapeODataValue BaseView */

/* exported DatatableView */
class DatatableView extends BaseView {
  preinitialize(options = {}) {

    // New property-factory override
    this.datatableDefinition = options.datatableDefinition || this.datatableDefinition;
    this.dom = options.dom || this.dom;
    this.webstorage = options.webstorage || this.webstorage;
    this.webstorageKey = options.webstorageKey || this.webstorageKey;
    this.stateSave = options.stateSave || this.stateSave;
    this.stateSaveCallback = options.stateSaveCallback || this.stateSaveCallback;
    this.stateLoadCallback = options.stateLoadCallback || this.stateLoadCallback;
    this.table = options.table || this.table;

    // New property
    this.datatable = null;

    super.preinitialize(options);
  }

  removeDatatable() {
    if (this.datatable) {
      this.datatable.destroy();
      this.datatable = null;
    }
  }

  remove() {
    this.removeDatatable();
    super.remove();
  }

  render() {
    this.removeDatatable();
    while (this.el.firstChild) {
      this.removeChild(this.el.firstChild);
    }

    const table = _.result(this, 'table');
    this.el.appendChild(table);

    const datatableDefinition = _.result(this, 'datatableDefinition');

    datatableDefinition.dom = _.result(datatableDefinition, 'dom') || _.result(this, 'dom');

    datatableDefinition.stateSave = _.result(datatableDefinition, 'stateSave') || _.result(this, 'stateSave');

    datatableDefinition.stateSaveCallback = datatableDefinition.stateSaveCallback || ((...args) => this.stateSaveCallback(...args));

    datatableDefinition.stateLoadCallback = datatableDefinition.stateLoadCallback || ((...args) => this.stateLoadCallback(...args));

    datatableDefinition.ajax = datatableDefinition.ajax || ((...args) => this.ajax(...args));

    datatableDefinition.initComplete = datatableDefinition.initComplete || ((...args) => this.initComplete(...args));

    this.datatable = $(table).DataTable(datatableDefinition);

    return super.render();
  }

  webStorage() {
    return _.result(this.collection, 'webStorage') || _.result(Backbone, 'webStorage');
  }

  datatableDefinition() {
    return {
      columns: [
        { title: 'Column 1', data: 'col1' },
        { title: 'Column 2', data: 'col2' },
        { title: 'Column 3', data: 'col3' },
        { width: 100, render() { return '<a href="#" class="btn btn-default">View</a>'; } }
      ],
      data: [
        { col1: 'Data (1, 1)', col2: 'Data (1, 2)', col3: 'Data (1, 3)' },
        { col1: 'Data (1, 2)', col2: 'Data (2, 2)', col3: 'Data (3, 3)' },
        { col1: 'Data (1, 3)', col2: 'Data (2, 3)', col3: 'Data (3, 3)' }
      ]
    };
  }

  dom() {
    return `<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'<'table-responsive'tr>>><'row'<'col-sm-5'i><'col-sm-7'p>>B`;
  }

  stateSave() {
    return false;
  }

  stateSaveCallback(settings, data) {
    const webStorage = _.result(this, 'webStorage') || _.result(this.collection, 'webStorage');
    const webstorageKey = _.result(this, 'webstorageKey') || _.result(this.collection, 'webstorageKey');

    webStorage.setItem(webstorageKey, JSON.stringify(data));
  }

  stateLoadCallback(settings) {
    const webStorage = _.result(this, 'webStorage') || _.result(this.collection, 'webStorage');
    const webstorageKey = _.result(this, 'webstorageKey') || _.result(this.collection, 'webstorageKey');

    try {
      return JSON.parse(webStorage.getItem(webstorageKey));
    } catch (error) {
      return;
    }
  }

  ajax(data, callback, settings) {
    const serverSide = settings.oFeatures.bServerSide;
    if (serverSide) {
      const datatableDefinition = _.result(this, 'datatableDefinition');
      const { columns, draw, length, order, search, start } = data;
      const queryObject = {};

      // $count
      queryObject['$count'] = true;

      // $select
      queryObject['$select'] = columns
        .filter(config => typeof config.data === 'string')
        .map(config => config.data)
        .filter((select, index, array) => array.indexOf(select) === index)
        .join(',');

      // $filter
      const filters = columns
        .map((column, index) => {
          if (column.searchable && column.search && column.search.value) {
            if (datatableDefinition && datatableDefinition.columns && datatableDefinition.columns[index]
              && datatableDefinition.columns[index].filterType) {

              switch (datatableDefinition.columns[index].filterType) {
                case 'custom function':
                  return `(${datatableDefinition.columns[index].filterFunction(column, datatableDefinition.columns[index])})`;

                case 'string equals':
                  return `${column.data} eq '${escapeODataValue(column.search.value)}'`;

                case 'string contains':
                  return `(${column.search.value
                    .split(' ')
                    .filter((value, index, array) => value && array.indexOf(value) === index)
                    .map(value => `contains(tolower(${column.data}),'${escapeODataValue(value.toLowerCase())}')`)
                    .join(' and ')})`;
              }
            }
            return `${column.data} eq ${escapeODataValue(column.search.value)}`;
          } else {
            return false;
          }
        })
        .filter(value => value);
      if (filters.length > 0) {
        queryObject['$filter'] = filters.join(' and ');
      }

      // $orderby
      if (order.length > 0) {
        queryObject['$orderby'] = order.map(config => {
          let orderBy = columns[config.column].data;
          if (datatableDefinition && datatableDefinition.columns
            && datatableDefinition.columns[config.column]
            && datatableDefinition.columns[config.column].orderType) {

            switch (datatableDefinition.columns[config.column].orderType) {
              case 'custom function':
                return datatableDefinition.columns[config.column].orderType
                  ? datatableDefinition.columns[config.column].orderType(config, orderBy, datatableDefinition.columns[config.column]) : null;

              case 'string':
                return `tolower(${orderBy}) ${config.dir}`;
            }
          }
          return `${orderBy} ${config.dir}`;
        }).filter(value => value).join(',');
      }

      // $search
      if (search && search.value) {
        queryObject['$search'] = search.value;
      }

      // $skip
      queryObject['$skip'] = start;

      // $top
      queryObject['$top'] = length;

      const queryArray = [];
      for (const key in queryObject) {
        queryArray.push(`${key}=${queryObject[key]}`);
      }

      this.collection.fetch({ query: queryArray.join('&') })
        .then((data) => {
          callback({
            data: this.collection.toJSON(),
            draw,
            recordsTotal: data['@odata.count'],
            recordsFiltered: data['@odata.count']
          });
        }, () => {
          callback({ data: [], draw, recordsTotal: 0, recordsFiltered: 0 });
        });
    }
  }

  initComplete(settings, json) {}

  table() {
    const newTable = document.createElement('table');
    newTable.classList.add('table', 'table-bordered');
    newTable.style.width = '100%';
    return newTable;
  }

  reload(callback, resetPaging) {
    if (this.datatable) {
      this.datatable.ajax.reload(callback, resetPaging);
    }
  }
}
