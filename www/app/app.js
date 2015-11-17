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
            .state('state2', {
                url: "/state2",
                templateUrl: "app/create.html",
                controller: 'CreateController'
            })
            .state('state2.list', {
                url: "/list",
                templateUrl: "app/state2.list.html",
                controller: 'State2ListCtrl'
            });
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");

    }]).run(['$log', function($log) {
    $log.info("App Module openK Eisman initiated");
}]);
