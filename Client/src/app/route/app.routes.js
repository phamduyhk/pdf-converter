(function () {
    'use strict';

    angular.module('myApp')
        .config(routeConfig);
    /**
     * Configures the routes and views
     */
    routeConfig.$inject = ['$stateProvider'];

    function routeConfig($stateProvider) {
        console.log('In routes config');
        // Routes
        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'front-end.html',
            })
            .state('topPage',{
                url:'/',
                templateUrl:'route/homepage.html',
                controller: 'homepageCtrl',
                controllerAs: '$ctrl' 
            })
    }
})();
