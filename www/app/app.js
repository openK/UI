angular.module('myApp', ['ui.router', 'timer', 'pascalprecht.translate', 'treeGrid', 'isteven-multi-select', 'ui.grid', 'ui.bootstrap', 'ngResource', 'ui.grid.selection', 'ui.grid.pagination', 'ui.grid.cellNav'])
    .config([
        '$stateProvider', '$urlRouterProvider', '$translateProvider', '$provide', function ($stateProvider, $urlRouterProvider, $translateProvider, $provide) {

            $provide.decorator('$state', [
                "$delegate", "$stateParams", '$timeout', function ($delegate, $stateParams, $timeout) {
                    $delegate.forceReload = function () {
                        var reload = function () {
                            $delegate.transitionTo($delegate.current, angular.copy($stateParams), {
                                reload: true,
                                inherit: true,
                                notify: true
                            });
                        };
                        $timeout(reload, 100);
                    };
                    return $delegate;
                }
            ]);

            $translateProvider.preferredLanguage('de');

            $translateProvider.useStaticFilesLoader({
                prefix: 'app/locale-',
                suffix: '.json'
            });

            // Now set up the states
            $stateProvider
                .state('state1', {
                    url: "/:show",
                    templateUrl: "app/overview.html",
                    controller: 'OverviewCtrl',
                    resolve: {
                        parentActivities: function (activityService, $stateParams, $rootScope) {
                            $rootScope.show = $stateParams.show;
                            activityService.resetActivity();
                            return activityService.loadParentActivities(0, 5, null, null, null, $stateParams.show);
                        }
                    }
                })
                .state('state1details', {
                    url: "/details/:activityId",
                    templateUrl: "app/details.html",
                    controller: 'DetailController'
                })
                // neuen Vorgang anlegen...
                .state('Regulation', {
                    url: "/Regulation",
                    templateUrl: "app/Regulation.html",
                    controller: 'RegulationController',
                    abstract: true,
                }).state('Regulation.CreateDownRegulation', {
                    url: '/CreateDownRegulation',
                    templateUrl: "app/CreateDownRegulation.html",
                    controller: 'CreateDownRegulationController',
                    resolve: {
                        activity: function (activityService) {
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('Regulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: "app/NetworkState.html",
                    abstract: true
                }).state('Regulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('Regulation.CreateSettings', {
                    url: '/CreateSettings',
                    templateUrl: "app/CreateSettings.html",
                    controller: 'CreateSettingsController',
                }).state('Regulation.CreateProposal', {
                    url: '/CreateProposal',
                    templateUrl: "app/CreateProposal.html",
                    controller: 'CreateProposalController',
                    abstract: true
                }).state('Regulation.CreateProposal.Main', {
                    url: '/Main',
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: "app/SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('Regulation.CreateProposalConfirmation', {
                    url: '/CreateProposalConfirmation/',
                    templateUrl: "app/CreateProposalConfirmation.html",
                    controller: 'CreateProposalConfirmationController',
                })






                // neue Maßnahme hinzufuegen...
                .state('ChangeRegulation', {
                    url: "/Change",
                    templateUrl: "app/ChangeRegulation.html",
                    controller: 'ChangeRegulationController',
                    abstract: true,
                    resolve: {
                        activity: function (activityService) {
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('ChangeRegulation.ChangeDownRegulation', {
                    url: '/ChangeDownRegulation',
                    templateUrl: "app/ChangeDownRegulation.html",
                    controller: 'ChangeDownRegulationController',
                    resolve: {
                        createActivity: function (activityService) {
                            return activityService.loadChildActivity();
                        }
                    }
                }).state('ChangeRegulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: "app/NetworkState.html",
                    abstract: true
                }).state('ChangeRegulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('ChangeRegulation.ChangeSettings', {
                    url: '/ChangeSettings',
                    templateUrl: "app/ChangeSettings.html",
                    controller: 'ChangeSettingsController',
                }).state('ChangeRegulation.ChangeProposal', {
                    url: '/ChangeProposal',
                    templateUrl: "app/ChangeProposal.html",
                    controller: 'ChangeProposalController',
                    abstract: true
                }).state('ChangeRegulation.ChangeProposal.Main', {
                    url: '/Main',
                    cache: false,
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: "app/SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('ChangeRegulation.ChangeProposalConfirmation', {
                    url: '/ChangeProposalConfirmation/',
                    templateUrl: "app/ChangeProposalConfirmation.html",
                    controller: 'ChangeProposalConfirmationController',
                })


                // neue Maßnahme bearbeiten...
                .state('EditRegulation', {
                    url: "/Edit",
                    templateUrl: "app/EditRegulation.html",
                    controller: 'EditRegulationController',
                    abstract: true,
                    resolve: {
                        activity: function (activityService) {
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('EditRegulation.EditDownRegulation', {
                    url: '/EditDownRegulation',
                    templateUrl: "app/EditDownRegulation.html",
                    controller: 'EditDownRegulationController',
                    resolve: {
                        loadActivity: function (activityService) {
                            return activityService.loadActivity();
                        }
                    }
                }).state('EditRegulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: "app/NetworkState.html",
                    abstract: true
                }).state('EditRegulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('EditRegulation.EditSettings', {
                    url: '/EditSettings',
                    templateUrl: "app/EditSettings.html",
                    controller: 'EditSettingsController',
                }).state('EditRegulation.EditProposal', {
                    url: '/EditProposal',
                    templateUrl: "app/EditProposal.html",
                    controller: 'EditProposalController',
                    abstract: true
                }).state('EditRegulation.EditProposal.Main', {
                    url: '/Main',
                    cache: false,
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: "app/SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: "app/NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: "app/NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('EditRegulation.EditProposalConfirmation', {
                    url: '/EditProposalConfirmation/',
                    templateUrl: "app/EditProposalConfirmation.html",
                    controller: 'CreateProposalConfirmationController',
                });
            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/Aktiv");

        }
    ]).run(['$log', '$rootScope', '$state', function ($log, $rootScope, $state) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.previousState = fromState;
            $rootScope.currentState = toState;
            $rootScope.currentParams = toParams;
            $rootScope.previousParams = fromParams;
        });
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log(unfoundState.to);
            console.log(unfoundState.toParams);
            console.log(unfoundState.options);
        });
        $rootScope.goBack = function () {
            $state.go($rootScope.previousState, $rootScope.previousParams);
        }
        $rootScope.multiSelectTranslation = {
            selectAll: "alles ausgewählen",
            selectNone: "nichts auswählen",
            reset: "zurücksetzen",
            search: "suchen...",
            nothingSelected: "keine Auswahl"
        }
    }]);
