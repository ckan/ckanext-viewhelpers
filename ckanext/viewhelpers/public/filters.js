this.ckan = this.ckan || {};
this.ckan.views = this.ckan.views || {};
this.ckan.views.viewhelpers = this.ckan.views.viewhelpers || {};

this.ckan.views.viewhelpers.filters = (function (queryString) {
  'use strict';

  var api = {
    get: get,
    _filters: {},
    _initialize: _initialize
  };

  function get(filterName) {
    if (filterName) {
      return api._filters[filterName];
    } else {
      return api._filters;
    }
  }

  function _initialize(queryString) {
    // The filters are in format 'field:value|field:value|field:value'
    var routeParams = queryString.queryStringToJSON();

    if (!routeParams || !routeParams.filters) {
      api._filters = {};
      return api._filters;
    }

    var filters = {},
        fieldValuesStr = routeParams.filters.split('|'),
        i,
        len;

    for (i = 0, len = fieldValuesStr.length; i < len; i++) {
      var fieldValue = fieldValuesStr[i].split(':'),
          field = fieldValue[0],
          value = fieldValue[1];

      filters[field] = filters[field] || [];
      filters[field].push(value);
    }

    api._filters = filters;

    return filters;
  }

  _initialize(queryString);

  return api;
})(window.location.search);
