(function () {
    "use strict";

    angular.module('myApp')
        .component('pdfOcr', {
            templateUrl: '/src/app/pdfOcrComponent/pdfOcr.tmpl.html',
            controller: pdfOcrCtrl,
            bindings:{
                originUrl:"<",
            }
        });

    pdfOcrCtrl.$inject = ['$scope','$http'];

    function pdfOcrCtrl($scope,$http) {
        var $ctrl = this;
        $ctrl.ocrResult =  "";
        console.log("pdfOcr component on!");
        $http.get('/api/ocr/', {
            params: {
                url:$ctrl.originUrl
            }
        }).then(function(response){
            console.log(response);
            $ctrl.ocrResult = response.data;
        });
        
    }
})();