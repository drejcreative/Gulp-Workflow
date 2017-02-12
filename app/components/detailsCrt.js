(function() {
  "use strict";

  angular
    .module("uploader")
    .controller("detailsController", function($scope, $state, $http, uploadFactory, $mdSidenav, $timeout) {

      var self = this; //cls.
      self.details = $state.params.upload;

      //Fix potential problems with timeout
      $timeout(function() {
        $mdSidenav('right').open();
      });

      //Watch for sidebar close
      $scope.$watch('cls.sidenavOpen', function(sidenav) {
        if(sidenav === false) {
          $mdSidenav('right').close()
          .then(function() {
            $state.go('dashboard');
          });
        }
      });

      //close sidebar
      self.closeSidebar = function () {
        self.sidenavOpen = false;
      };

      //Save new classifield
      self.deleteUpload = function(details) {
          console.log(details);
          $scope.$emit('deleteUploads', details);
          self.sidenavOpen = false;
      };

    $scope.colors = ['#2C99CB', '#C62828', '#C1BA16'];
    $scope.labels = ['100kbs', '500kbs', '1Mbs', '2Mbs', '5Mbs', '10Mbs', '100Mbs'];
    $scope.data = [
      [100, 29, 80, 75, 10, 8, 5],
      [100, 60, 90, 90, 20, 10, 12]
    ];
    $scope.datasetOverride = [
      {
        label: "Speed",
        borderWidth: 1,
        type: 'bar'
      },
      {
        label: "Max Speed",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: 'line'
      }
    ];

  });
})();
