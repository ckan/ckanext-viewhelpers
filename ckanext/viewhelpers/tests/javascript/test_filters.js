var requirejs = require('requirejs');
var chai = requirejs('chai');
var assert = chai.assert;

requirejs.config({
  shim: {
    'ckanext/viewhelpers/public/filters.js': {
      depends: ['ckanext/viewhelpers/public/vendor/queryStringToJSON.js'],
      exports: 'ckan'
    }
  }
});

// We shouldn't be required to load this, as its a dependency. I'm not sure why
// it's not working.
requirejs('ckanext/viewhelpers/public/vendor/queryStringToJSON.js');

describe('ckan.views.viewhelpers.filters', function(){
  var filters;

  before(function() {
    var ckan;

    window = {
      location: {
        search: ''
      }
    };

    ckan = requirejs('ckanext/viewhelpers/public/filters.js');
    filters = ckan.views.viewhelpers.filters;
  });

  beforeEach(function() {
    filters._initialize('');
  });

  describe('#initialization', function() {
    it('should start as an empty object', function() {
      filters._initialize('');
      assert.deepEqual({}, filters._filters);
    });

    it('should work with multiple filters', function() {
      var expectedFilters = {
        country: ['Brazil'],
        state: ['Paraiba']
      };

      filters._initialize('?filters=country:Brazil|state:Paraiba');

      assert.deepEqual(expectedFilters, filters._filters);
    });

    it('should work with multiple values for the same filter', function() {
      var expectedFilters = {
        country: ['Brazil', 'Argentina'],
        state: ['Paraiba']
      };

      filters._initialize('?filters=country:Brazil|state:Paraiba|country:Argentina');

      assert.deepEqual(expectedFilters, filters._filters);
    });

    it('should keep the order defined in the query string', function() {
      var expectedFiltersSorted = {
            country: ['Argentina', 'Brazil']
          },
          expectedFiltersReverse = {
            country: ['Brazil', 'Argentina']
          };

      filters._initialize('?filters=country:Argentina|country:Brazil');
      assert.deepEqual(expectedFiltersSorted, filters._filters);

      filters._initialize('?filters=country:Brazil|country:Argentina');
      assert.deepEqual(expectedFiltersReverse, filters._filters);
    });
  });

  describe('#get', function(){
    it('should return all filters if called without params', function(){
      var expectedFilters = {
        country: ['Brazil']
      };


      filters._initialize('?filters=country:Brazil');

      assert.deepEqual(expectedFilters, filters.get());
    });

    it('should return the requested filter field', function(){
      var countryFilter;

      filters._initialize('?filters=country:Brazil');

      countryFilter = filters.get('country');

      assert.equal(1, countryFilter.length);
      assert.equal('Brazil', countryFilter[0]);
    });

    it('should return undefined if there\'s no filter with the requested field', function(){
      var cityFilter;
      filters._initialize('?filters=country:Brazil');

      cityFilter = filters.get('city');

      assert.equal(undefined, cityFilter);
    });
  });
});
