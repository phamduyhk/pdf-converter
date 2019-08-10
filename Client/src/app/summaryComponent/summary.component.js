(function () {
    "use strict";

    angular.module('myApp')
        .component('summaryComponent', {
            templateUrl: '/src/app/summaryComponent/summary.tmpl.html',
            controller: summaryCtrl,
            bindings:{
            }
        });

    summaryCtrl.$inject = ['$scope', '$http'];

    function summaryCtrl($scope, $http) {
        var $ctrl = this;
        console.log("summary component on!");
        
    }
})();