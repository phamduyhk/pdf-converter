(function () {
    "use strict";

    angular.module('myApp')
        .component('pdfOcr', {
            templateUrl: '/src/app/pdfOcrComponent/pdfOcr.tmpl.html',
            controller: pdfOcrCtrl,
        });

    pdfOcrCtrl.$inject = ['$scope'];

    function pdfOcrCtrl($scope) {
        var $ctrl = this;
        console.log("pdfOcr component on!");
    }
})();