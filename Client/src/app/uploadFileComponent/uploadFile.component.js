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

    uploadFileCtrl.$inject = ['$scope'];

    function uploadFileCtrl($scope) {
        var $ctrl = this;
        console.log("uploadFile component on!");
        $ctrl.$onInit = function () {
            $ctrl.files = [];
        }
        var input = document.querySelector('input');
        input.addEventListener('change', $ctrl.files);

    }
})();