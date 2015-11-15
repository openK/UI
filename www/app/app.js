angular.module('myApp', ['ui.router', 'timer', 'pascalprecht.translate', 'treeGrid', 'isteven-multi-select', 'ngTouch', 'ui.grid', 'ui.bootstrap', 'ngResource', 'ui.grid.selection', 'ui.grid.pagination'])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider, $translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('de');
        $translateProvider.useSanitizeValueStrategy('escaped');
        //$translateProvider.useLoaderCache(true);

        // Now set up the states
        $stateProvider
            .state('state1', {
                url: "/state1",
                templateUrl: "app/state1.html",
                controller: 'State1Ctrl'
            })
            .state('state1.list', {
                url: "/list",
                templateUrl: "app/state1.list.html",
                controller: 'State1ListCtrl'
            })
            .state('state2', {
                url: "/state2",
                templateUrl: "app/state2.html",
                controller: 'State2Ctrl'
            })
            .state('state2.list', {
                url: "/list",
                templateUrl: "app/state2.list.html",
                controller: 'State2ListCtrl'
            });
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/state1");
    }]).controller('State1Ctrl', ['$scope', function ($scope) {
        console.log('State1Ctrl');
    }]).controller('State2Ctrl', ['$scope', function ($scope) {
        console.log('State2Ctrl');
    }]).controller('State1ListCtrl', ['$scope', '$http', function ($scope, $http) {
        $scope.items = ["A", "List", "Of", "Items"];
        $http.get('test.json').then(function(result){
            alert('succsess');
        }, function(error){
            alert(JSON.stringify(error));
        });
    }]).controller('State2ListCtrl', ['$scope', function ($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
    }])
    .run(['$log', function($log) {
        $log.info("App Module openK Eisman initiated");
    }]);
