var requirejs = require('requirejs');
var chai = requirejs('chai');
var assert = chai.assert;
var sinon = requirejs('sinon');
var jquery = requirejs('jquery');
var jsdom = requirejs('jsdom');

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

    window = jsdom.jsdom().createWindow();
    document = window.document;
    $ = jquery.create(window);

    ckan = requirejs('ckanext/viewhelpers/public/filters.js');
    filters = ckan.views.viewhelpers.filters;
  });

  beforeEach(function() {
    filters._initialize('');
  });

  describe('#initialization', function() {
    it('should start as an empty object', function() {
      filters._initialize('');
      assert.equal(undefined, filters.get());
    });

    it('should clear the filters on subsequent calls', function() {
      filters._initialize('?filters=country:Brazil');
      assert.deepEqual(['Brazil'], filters.get('country'));
      filters._initialize('');
      assert.deepEqual(undefined, filters.get());
    });

    it('should work with multiple filters', function() {
      var expectedFilters = {
        country: ['Brazil'],
        state: ['Paraiba']
      };

      filters._initialize('?filters=country:Brazil|state:Paraiba');

      assert.deepEqual(expectedFilters, filters.get());
    });

    it('should work with multiple values for the same filter', function() {
      var expectedFilters = {
        country: ['Brazil', 'Argentina'],
        state: ['Paraiba']
      };

      filters._initialize('?filters=country:Brazil|state:Paraiba|country:Argentina');

      assert.deepEqual(expectedFilters, filters.get());
    });

    it('should keep the order defined in the query string', function() {
      var expectedFiltersSorted = {
            country: ['Argentina', 'Brazil']
          },
          expectedFiltersReverse = {
            country: ['Brazil', 'Argentina']
          };

      filters._initialize('?filters=country:Argentina|country:Brazil');
      assert.deepEqual(expectedFiltersSorted, filters.get());

      filters._initialize('?filters=country:Brazil|country:Argentina');
      assert.deepEqual(expectedFiltersReverse, filters.get());
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

  describe('#set', function(){
    it('should set the filters', function(){
      var expectedFilters = {
        country: 'Brazil'
      };

      filters.set('country', 'Brazil');

      assert.deepEqual(expectedFilters, filters.get());
    });

    it('should update the url', function(){
      var expectedSearch = '?filters=country%3ABrazil%7Ccountry%3AArgentina' +
                           '%7Cindicator%3Ahappiness';

      filters.set('country', ['Brazil', 'Argentina']);
      filters.set('indicator', 'happiness');

      assert.equal(expectedSearch, window.location.search);
    });
  });
});
