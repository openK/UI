angular.module('myApp', ['ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
    console.log('State1Ctrl')
}]).controller('State2Ctrl', ['$scope', function ($scope) {
    console.log('State2Ctrl')
}]).controller('State1ListCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.items = ["A", "List", "Of", "Items"];
    $http.get('app/findparentactivitylist.json').then(function(result){
        alert('success');
    }, function(error){
       alert(JSON.stringify(error))
    });
}]).controller('State2ListCtrl', ['$scope', function ($scope) {
    $scope.things = ["A", "Set", "Of", "Things"];
}]);
