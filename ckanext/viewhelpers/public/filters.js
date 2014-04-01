this.ckan = this.ckan || {};
this.ckan.views = this.ckan.views || {};
this.ckan.views.viewhelpers = this.ckan.views.viewhelpers || {};

this.ckan.views.viewhelpers.filters = (function (queryString) {
  'use strict';

  var api = {
    get: get,
    set: set,
    setAndRedirectTo: setAndRedirectTo,
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
    var url = window.location.href;

    setAndRedirectTo(name, value, url);
  }

  function setAndRedirectTo(name, value, url) {
    api._searchParams.filters = api._searchParams.filters || {};
    api._searchParams.filters[name] = value;

    _redirectTo(url);

    return api;
  }

  function _redirectTo(url) {
    var urlBase = url.split('?')[0],
        urlQueryString = url.split('?')[1] || '',
        defaultParams = urlQueryString.queryStringToJSON(),
        queryString = _encodedParams(defaultParams),
        destinationUrl;

    destinationUrl = urlBase + '?' + queryString;

    window.location.href = destinationUrl;
  }

  function _encodedParams(defaultParams) {
    var params = $.extend({}, defaultParams || {}, api._searchParams);

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
