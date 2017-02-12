(function() {
  "use strict";
  angular
    .module('uploader')
    .factory('uploadFactory', function($http) {

      var urlBase = ' http://localhost:3000/files';
      var dataFactory = {};

      // Get data from server
      dataFactory.getUploads = function () {
        return $http.get(urlBase);
      };

      dataFactory.getUpload = function (id) {
          return $http.get(urlBase + id);
      };
      // Add new Classifield
      dataFactory.addUpload = function (data) {
          return $http.post(urlBase, data);
      };

      dataFactory.updateClassifield = function (data) {
          return $http.put(urlBase + '/' + clsdata._id, clsdata);
      };

      dataFactory.deleteUpload= function (c) {
          return $http.delete(urlBase + '/' +  c.id);
      };

      return dataFactory;

    });
})();
