angular
  .module('uploader', ["ngMaterial", "ui.router", "angularUtils.directives.dirPagination", "ng-file-model", "ngFileUpload", "chart.js"])
  .config(function($mdThemingProvider, $stateProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('blue-grey');

    $stateProvider
    .state('dashboard', {
      url: '/',
      templateUrl: 'components/dashboard.html',
      controller: 'dashboardCtrl as cls'
    }).state('dashboard.details', {
      url: 'details/:id',
      templateUrl: 'components/details.html',
      controller: 'detailsController as cls',
      params: {
        upload: null
      }
    });

  }).filter('bytes', function() {
  	return function(bytes, precision) {
  		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
  		if (typeof precision === 'undefined') precision = 1;
  		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
  			number = Math.floor(Math.log(bytes) / Math.log(1024));
  		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
  	};
  }).filter('unique', function () {
      return function (items, filterOn) {
        if (filterOn === false) {
          return items;
        }
        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
          var hashCheck = {}, newItems = [];
          var extractValueToCompare = function (item) {
            if (angular.isObject(item) && angular.isString(filterOn)) {
              return item[filterOn];
            } else {
              return item;
            }
          };
          angular.forEach(items, function (item) {
            var valueToCheck, isDuplicate = false;
            for (var i = 0; i < newItems.length; i++) {
              if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                isDuplicate = true;
                break;
              }
            }
            if (!isDuplicate) {
              newItems.push(item);
            }
          });
          items = newItems;
        }
        return items;
      };
    }).config(['ChartJsProvider', function (ChartJsProvider) {
    ChartJsProvider.setOptions({
      responsive: false
    });
    ChartJsProvider.setOptions('line', {
      showLines: false
    });
  }]);
