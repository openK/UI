angular.module('myApp', ['ui.router', 'timer', 'pascalprecht.translate', 'treeGrid', 'isteven-multi-select', 'ui.grid', 'ui.bootstrap', 'ngResource', 'ui.grid.selection', 'ui.grid.pagination'])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {

        $translateProvider.preferredLanguage('de');
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/locale-',
            suffix: '.json'
        });

        // Now set up the states
        $stateProvider
            .state('state1', {
                url: "/home",
                templateUrl: "app/Overview.html",
                controller: 'OverviewCtrl',
            })
            .state('state1details', {
                url: "/details/:activityId",
                templateUrl: "app/details.html",
                controller: 'DetailController'
            })
            .state('Regulation', {
                url: "/Regulation",
                templateUrl: "app/Regulation.html",
                abstract: true
            })
            .state('Regulation.CreateDownRegulation', {
                url: '/CreateDownRegulation',
                templateUrl: "app/CreateDownRegulation.html",
                controller: 'CreateDownRegulationController'
            }).state('Regulation.NetworkState', {
                url: '/NetworkState',
                templateUrl: "app/NetworkState.html",
                controller: 'NetworkStateController'
            });
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");

    }]).run(['$log', function($log) {
        $log.info("App Module openK Eisman initiated");
}]);
