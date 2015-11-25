angular.module('myApp', ['ui.router', 'timer', 'pascalprecht.translate', 'treeGrid', 'isteven-multi-select', 'ui.grid', 'ui.bootstrap', 'ngResource', 'ui.grid.selection', 'ui.grid.pagination','ui.grid.cellNav'])
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
                resolve: {
                    parentActivities: function (activityService) {
                        return activityService.loadParentActivities();
                    }
                }
            })
            .state('state1details', {
                url: "/details/:activityId",
                templateUrl: "app/details.html",
                controller: 'DetailController'
            })
            .state('Regulation', {
                url: "/Regulation",
                templateUrl: "app/Regulation.html",
                controller: 'RegulationController',
                abstract: true,
                resolve: {
                    activity: function(activityService) {
                        return activityService.loadConfiguration();
                    }

                }
            })
            .state('Regulation.CreateDownRegulation', {
                url: '/CreateDownRegulation',
                templateUrl: "app/CreateDownRegulation.html",
                controller: 'CreateDownRegulationController'
            }).state('Regulation.NetworkState', {
                url: '/NetworkState',
                templateUrl: "app/NetworkState.html",
                abstract: true
            }).state('Regulation.NetworkState.Main', {
                url: '/Main',
                views: {
                    "NetworkMainState": {
                        templateUrl: "app/NetworkMainState.html",
                        controller: 'NetworkMainStateController'
                    },
                    "NetworkSubState": {
                        templateUrl: "app/NetworkSubState.html",
                        controller: 'NetworkSubStateController'
                    }
                }
            }).state('Regulation.CreateSettings', {
                url: '/CreateSettings',
                templateUrl: "app/CreateSettings.html",
                controller: 'CreateSettingsController'
            }).state('Regulation.CreateProposal', {
                url: '/CreateProposal',
                templateUrl: "app/CreateProposal.html",
                controller: 'CreateProposalController',
                abstract: true
            }).state('Regulation.CreateProposal.Main', {
                url: '/Main',
                views: {
                    "NetworkMainState": {
                        templateUrl: "app/NetworkMainState.html",
                        controller: 'NetworkMainStateController'
                    },
                    "NetworkSubState": {
                        templateUrl: "app/NetworkSubState.html",
                        controller: 'SelectedNetworkSubStationController'
                    }
                }
            }).state('Regulation.CreateProposalConfirmation', {
                url: '/CreateProposalConfirmation/',
                templateUrl: "app/CreateProposalConfirmation.html",
                controller: 'CreateProposalConfirmationController',
            });
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");

    }]).run(['$log', function ($log) {
        $log.info("App Module openK Eisman initiated");
    }]);
