(function() {
  "use strict";

  angular
    .module("uploader")
    .controller("dashboardCtrl", function($scope, $http, $state, uploadFactory, Upload) {

      var self = this; //cls.
      var date = new Date();
      self.pageSize = 10;

      //Geting data from server
      uploadFactory.getUploads().success(function(data){
        self.uploads = data;
        self.prevProgress = 0;
        self.sortType = '-date';
        console.log(data);
      }).error(function(data, status){
        console.log(data, status);
        self.uploads = [];
      });

      //Categories
      self.categories = [
        "Personal Files",
        "Job related",
        "Important"
      ];

      //Refreshing scope
      $scope.refresh = function(){
        uploadFactory.getUploads().success(function(data){
          self.uploads = data;
          //self.categories = data.category;
          self.prevProgress = 0;
          //$scope.isLoading = false;
          //Sorting by id as default
          //self.sortType = 'posted';
          //console.log(data);
        }).error(function(data, status){
          console.log(data, status);
          self.uploads = [];
        });
      };

      //Add Category
      self.uploadCategory = function(data) {
        self.categories.push(data);
        console.log(data);
        self.data = "";
      };

      //Add new file
      self.uploadFile = function(data) {
        self.timeStamp = Date.now();
        self.prevProgress = 0;
         data.name = data.name;
         data.category = data.category;
         data.date = new Date();
         //self.file.date = data.date;
         data.id = self.uploads.length + 1;
         uploadFactory.addUpload(data)
              .then(function (response) {
                  //$scope.status = 'Inserted Customer! Refreshing customer list.';

                  self.prevProgress = 100;
                  self.uploads.push(data);
                  document.getElementById('file').value = null;
                  swal({
                    title: "Good job!",
                    text: "Upload successful!",
                    type: "success",
                    confirmButtonColor: "#2C99CB"
                  });
                  console.log("success");
                  console.log('progress: ' + self.prevProgress + '% ');
                  //showToast('Classifield Saved!');
              }, function(error) {
                  //$scope.status = 'Unable to insert customer: ' + error.message;
                  //showToast('Problem with adding new Classifields!');
         });
      };

      self.clear = function() {
        $('.dashboard__progress--bar').css('width', '0%');
      };

      //Show Details
      self.details = function(c) {
        $state.go('dashboard.details', {
          id: c.id,
          upload: c
        });
      };

      //Delete Uploads
      self.deleteUpload = function(event, c) {
        swal({
          title: "Are you sure?",
          text: "You will not be able to recover this file!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C62828",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },
        function(){
          uploadFactory.deleteUpload(c)
                      .then(function (response) {
                          // var index = self.classifields.indexOf(c);
                          // self.classifields.splice(index, 1);
                          // showToast('Classifield Deleted!');
                          swal({
                            title: "Good job!",
                            text: "Delete successful!",
                            type: "success",
                            confirmButtonColor: "#2C99CB"
                          });
                          console.log('deleted');
                          $scope.refresh();
                      }, function (error) {
                          $scope.status = 'Error retrieving customers! ' + error.message;
                      });
        });
      };

      //Edit Uploads
      $scope.$on('deleteUploads', function(event, details) {
          swal({
            title: "Are you sure?",
            text: "You will not be able to recover this file!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#C62828",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
          },
          function(){
        uploadFactory.deleteUpload(details)
                    .then(function (response) {
                        swal({
                          title: "Good job!",
                          text: "Delete successful!",
                          type: "success",
                          confirmButtonColor: "#2C99CB"
                        });
                        console.log('deleted');
                        $scope.refresh();
                    }, function (error) {
                        $scope.status = 'Error retrieving customers! ' + error.message;
                      });
        });
      });

      //Adding active class
      $('.sidenav__item').on('click', function(e) {
        e.stopPropagation();
        $('.sidenav__item').removeClass('active');
        var clicked = this;
        $(this).addClass('active');
      });

    });
})();
