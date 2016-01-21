angular.module('myApp', ['ui.router', 'timer', 'pascalprecht.translate', 'treeGrid', 'isteven-multi-select', 'ui.grid', 'ui.grid.resizeColumns', 'ui.bootstrap', 'ngResource', 'ui.grid.selection', 'ui.grid.pagination', 'ui.grid.cellNav'])
    .config(['$stateProvider', '$urlRouterProvider', '$translateProvider', '$provide', function ($stateProvider, $urlRouterProvider, $translateProvider, $provide) {

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
                prefix: templPath + 'locale-',
                suffix: '.json'
            });

            // Now set up the states
            $stateProvider
                .state('state1', {
                    url: "/:show",
                    templateUrl: templPath + "overview.html",
                    controller: 'OverviewCtrl',
                    resolve: {
                        parentActivities: function (activityService, $stateParams, $rootScope) {
                            $rootScope.show = $stateParams.show;
                            return activityService.loadParentActivities(0, 5, null, null, null, $stateParams.show);
                        }
                    }
                })
                // neuen Vorgang anlegen...
                .state('Regulation', {
                    url: "/Regulation",
                    templateUrl: templPath +  "Regulation.html",
                    controller: 'RegulationController',
                    abstract: true,
                }).state('Regulation.CreateDownRegulation', {
                    url: '/CreateDownRegulation',
                    templateUrl: templPath + "CreateDownRegulation.html",
                    controller: 'CreateDownRegulationController',
                    resolve: {
                        activity: function (activityService, $rootScope, $state) {
                            if ($state.current.name === 'state1') {
                                activityService.resetActivity();
                            }
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('Regulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: templPath +  "NetworkState.html",
                    abstract: true
                }).state('Regulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('Regulation.CreateSettings', {
                    url: '/CreateSettings',
                    templateUrl: templPath +  "CreateSettings.html",
                    controller: 'CreateSettingsController',
                }).state('Regulation.CreateProposal', {
                    url: '/CreateProposal',
                    templateUrl: templPath +  "CreateProposal.html",
                    controller: 'CreateProposalController',
                    abstract: true
                }).state('Regulation.CreateProposal.Main', {
                    url: '/Main',
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: templPath +  "SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('Regulation.CreateProposalConfirmation', {
                    url: '/CreateProposalConfirmation/',
                    templateUrl: templPath +  "CreateProposalConfirmation.html",
                    controller: 'CreateProposalConfirmationController',
                })






                // neue MaÃŸnahme hinzufuegen...
                .state('ChangeRegulation', {
                    url: "/Change",
                    templateUrl: templPath +  "ChangeRegulation.html",
                    controller: 'ChangeRegulationController',
                    abstract: true,
                    resolve: {
                        activity: function (activityService) {
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('ChangeRegulation.ChangeDownRegulation', {
                    url: '/ChangeDownRegulation',
                    templateUrl: templPath +  "ChangeDownRegulation.html",
                    controller: 'ChangeDownRegulationController',
                    resolve: {
                        createActivity: function (activityService) {
                            return activityService.loadActivity();
                        }
                    }
                }).state('ChangeRegulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: templPath +  "NetworkState.html",
                    abstract: true
                }).state('ChangeRegulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('ChangeRegulation.ChangeSettings', {
                    url: '/ChangeSettings',
                    templateUrl: templPath +  "ChangeSettings.html",
                    controller: 'ChangeSettingsController',
                }).state('ChangeRegulation.ChangeProposal', {
                    url: '/ChangeProposal',
                    templateUrl: templPath +  "ChangeProposal.html",
                    controller: 'ChangeProposalController',
                    abstract: true
                }).state('ChangeRegulation.ChangeProposal.Main', {
                    url: '/Main',
                    cache: false,
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: templPath +  "SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('ChangeRegulation.ChangeProposalConfirmation', {
                    url: '/ChangeProposalConfirmation/',
                    templateUrl: templPath +  "ChangeProposalConfirmation.html",
                    controller: 'ChangeProposalConfirmationController',
                })


                // neue MaÃŸnahme bearbeiten...
                .state('EditRegulation', {
                    url: "/Edit",
                    templateUrl: templPath +  "EditRegulation.html",
                    controller: 'EditRegulationController',
                    abstract: true,
                    resolve: {
                        activity: function (activityService) {
                            return activityService.loadConfiguration();
                        }

                    }
                }).state('EditRegulation.EditDownRegulation', {
                    url: '/EditDownRegulation',
                    templateUrl: templPath +  "EditDownRegulation.html",
                    controller: 'EditDownRegulationController',
                    resolve: {
                        loadActivity: function (activityService) {
                            return activityService.loadActivity();
                        }
                    }
                }).state('EditRegulation.NetworkState', {
                    url: '/NetworkState',
                    templateUrl: templPath +  "NetworkState.html",
                    abstract: true
                }).state('EditRegulation.NetworkState.Main', {
                    url: '/Main',
                    views: {
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateInfoController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: 'NetworkSubStateInfoController'
                        }
                    }
                }).state('EditRegulation.EditSettings', {
                    url: '/EditSettings',
                    templateUrl: templPath +  "EditSettings.html",
                    controller: 'EditSettingsController',
                }).state('EditRegulation.EditProposal', {
                    url: '/EditProposal',
                    templateUrl: templPath +  "EditProposal.html",
                    controller: 'EditProposalController',
                    abstract: true
                }).state('EditRegulation.EditProposal.Main', {
                    url: '/Main',
                    cache: false,
                    views: {
                        "SelectedNetworkSubStations": {
                            templateUrl: templPath +  "SelectedNetworkSubStation.html",
                            controller: "SelectedNetworkSubStationController"
                        },
                        "NetworkMainState": {
                            templateUrl: templPath +  "NetworkMainState.html",
                            controller: 'NetworkMainStateController'
                        },
                        "NetworkSubState": {
                            templateUrl: templPath +  "NetworkSubState.html",
                            controller: "NetworkSubStateController"
                        }
                    }
                }).state('EditRegulation.EditProposalConfirmation', {
                    url: '/EditProposalConfirmation/',
                    templateUrl: templPath +  "EditProposalConfirmation.html",
                    controller: 'EditProposalConfirmationController',
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
        };
        $rootScope.multiSelectTranslation = {
            selectAll: "alles ausgewÃ¤hlen",
            selectNone: "nichts auswÃ¤hlen",
            reset: "zurÃ¼cksetzen",
            search: "suchen...",
            nothingSelected: "keine Auswahl"
        };
        $rootScope.templPath = templPath;
    }]);
