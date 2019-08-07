(function () {
    'use strict';
    angular.module('myApp', ["ui.router", "ngMaterial"
        ])
        .config(config)
        .run(run);

    config.$inject = ['$urlRouterProvider', '$locationProvider'];

    function config($urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/');
    }

    run.$inject = ['$http', '$rootScope', '$window'];

    function run($http, $rootScope,$window) {
         console.log("app module started!");
    }
})();
