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
                    parentActivities: function (activityService, $stateParams, $q, $rootScope) {
                        $rootScope.show = $stateParams.show;
                        var promises = [];
                        promises.push(activityService.loadConfiguration());
                        promises.push(activityService.loadParentActivities(0, 5, null, null, null, $stateParams.show));
                        return $q.all(promises);
                    }
                }
            })
            // neuen Vorgang anlegen...
            .state('Regulation', {
                url: "/Regulation",
                templateUrl: templPath + "Regulation.html",
                controller: 'RegulationController',
                abstract: true,
            }).state('Regulation.CreateDownRegulation', {
                url: '/CreateDownRegulation/:mode',
                templateUrl: templPath + "CreateDownRegulation.html",
                controller: 'CreateDownRegulationController',
                resolve: {
                    activity: function (activityService, $state, $stateParams, $q) {
                        if ($state.current.name === 'state1') {
                            activityService.resetActivity();
                            if ($stateParams.mode !== 'new') {
                                return activityService.loadActivity();
                            }
                        }
                        return $q.when();
                    }

                }
            }).state('Regulation.NetworkState', {
                url: '/NetworkState',
                templateUrl: templPath + "NetworkState.html",
                abstract: true
            }).state('Regulation.NetworkState.Main', {
                url: '/Main',
                views: {
                    "NetworkMainState": {
                        templateUrl: templPath + "NetworkMainState.html",
                        controller: 'NetworkMainStateInfoController'
                    },
                    "NetworkSubState": {
                        templateUrl: templPath + "NetworkSubState.html",
                        controller: 'NetworkSubStateInfoController'
                    }
                }
            }).state('Regulation.CreateSettings', {
                url: '/CreateSettings/:mode',
                controller: 'CreateSettingsController',
                templateUrl: function ($stateParams) {
                    var prefix = "Create";
                    if ($stateParams.mode === 'add') {
                        prefix = 'Change'
                    }
                    return templPath + prefix + "Settings.html"
                },
            }).state('Regulation.CreateProposal', {
                url: '/CreateProposal',
                templateUrl: templPath + "CreateProposal.html",
                controller: 'CreateProposalController',
                abstract: true
            }).state('Regulation.CreateProposal.Main', {
                url: '/Main',
                views: {
                    "SelectedNetworkSubStations": {
                        templateUrl: templPath + "SelectedNetworkSubStation.html",
                        controller: "SelectedNetworkSubStationController"
                    },
                    "NetworkMainState": {
                        templateUrl: templPath + "NetworkMainState.html",
                        controller: 'NetworkMainStateController'
                    },
                    "NetworkSubState": {
                        templateUrl: templPath + "NetworkSubState.html",
                        controller: "NetworkSubStateController"
                    }
                },
                resolve: {
                    calculateAdvice: function (activityService, modalServiceNew, $state, $q) {
                        return activityService.calculateReductionAdvice().then(function (result) {
                            $q.when(result);
                        }, function (error) {
                            modalServiceNew.showErrorDialog(error);
                            return $q.reject(error);
                        });
                    }
                }

            }).state('Regulation.CreateProposalConfirmation', {
                url: '/CreateProposalConfirmation/',
                templateUrl: templPath + "CreateProposalConfirmation.html",
                controller: 'CreateProposalConfirmationController',
            })

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
            selectAll: "alles ausgewählen",
            selectNone: "nichts auswählen",
            reset: "zurücksetzen",
            search: "suchen...",
            nothingSelected: "keine Auswahl"
        };
        $rootScope.templPath = templPath;
    }]);
