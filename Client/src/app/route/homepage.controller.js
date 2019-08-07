(function () {
    'use strict';

    angular.module('myApp')
        .controller('homepageCtrl', homepageCtrl);

    homepageCtrl.$inject = ['$scope'];

    function homepageCtrl($scope) {
        var $ctrl = this;
        console.log("homepageCtrl ok");
    }
})();