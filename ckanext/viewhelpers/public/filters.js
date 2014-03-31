this.ckan = this.ckan || {};
this.ckan.views = this.ckan.views || {};
this.ckan.views.viewhelpers = this.ckan.views.viewhelpers || {};

this.ckan.views.viewhelpers.filters = (function (queryString) {
  'use strict';

  var api = {
    get: get,
    set: set,
    _searchParams: {},
    _initialize: _initialize
  };

  function get(filterName) {
    var filters = api._searchParams.filters || {};

    if (filterName) {
      return filters[filterName];
    } else {
      return filters;
    }
  }

  function set(name, value) {
    api._searchParams.filters = api._searchParams.filters || {};
    api._searchParams.filters[name] = value;

    _updateFilters();

    return api;
  }

  function _updateFilters() {
    window.location.search = _encodedParams();
  }

  function _encodedParams() {
    var params = $.extend({}, api._searchParams);

    if (params.filters) {
      params.filters = $.map(params.filters, function (fields, filter) {
        if (!$.isArray(fields)) {
          fields = [fields];
        }

        var fieldsStr = $.map(fields, function (field) {
          return filter + ':' + field;
        });

        return fieldsStr.join('|');
      }).join('|');
    }

    return $.param(params);
  }

  function _initialize(queryString) {
    // The filters are in format 'field:value|field:value|field:value'
    var searchParams = queryString.queryStringToJSON();

    if (searchParams.filters) {
      var filters = {},
          fieldValuesStr = searchParams.filters.split('|'),
          i,
          len;

      for (i = 0, len = fieldValuesStr.length; i < len; i++) {
        var fieldValue = fieldValuesStr[i].split(':'),
            field = fieldValue[0],
            value = fieldValue[1];

        filters[field] = filters[field] || [];
        filters[field].push(value);
      }

      searchParams.filters = filters;
    }

    api._searchParams = searchParams;
  }

  _initialize(queryString);

  return api;
})(window.location.search);
