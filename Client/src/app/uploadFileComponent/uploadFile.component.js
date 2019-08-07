(function () {
    "use strict";

    angular.module('myApp')
        .component('uploadFile', {
            templateUrl: '/src/app/uploadFileComponent/uploadFile.tmpl.html',
            controller: uploadFileCtrl,
            binding: {
                uploadedFileSrc: '@'
            }
        });

    uploadFileCtrl.$inject = ['$scope', "Upload","$window"];

    function uploadFileCtrl($scope, Upload,$window) {
        var $ctrl = this;
        console.log("uploadFile component on!");
        $ctrl.$onInit = function () {
            $ctrl.files = [];
        }

        $ctrl.submit = function () { //function to call on form submit
            console.log($ctrl.file);
            if ($ctrl.file) { //check if from is valid
                $ctrl.upload($ctrl.file); //call upload function
            }
            var now = new Date();
            $ctrl.fileName = now.getTime();
            console.log($ctrl.fileName);
        };

        $ctrl.upload = function (file) {
            console.log('in Upload');
            console.log($ctrl.fileName);
            Upload.rename(file, $ctrl.fileName);
            Upload.upload({
                url: '/api/pdf/upload', //webAPI exposed to upload the file
                data: {
                    file: file
                } //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if (resp.data.error_code === 0) { //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    console.log(resp);
                    $ctrl.outUrl = resp.data.msg;
                    console.log($ctrl.outUrl);
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $ctrl.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }
})();