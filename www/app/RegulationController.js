/********************************************************************************
 * Copyright (c) 2015 BTC AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Stefan Brockmann - initial API and implementation
 * Jan Krueger - initial API and implementation
 *******************************************************************************/

app.controller('RegulationController', ['$scope', '$rootScope', '$http', '$modal', '$log', '$interval', function ($scope, $rootScope, $http, $modal, $log, $interval) {

    $scope.getParam = function getParameterByName(name) {

        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);

        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    $scope.timerTick = 700;
    $scope.recalculate = true;

    $scope.tabs = [{
        title: 'CREATE.REGULATIONTAB',
        id: 'regulation'
    }, {
        title: 'CREATE.STATIONLIST',
        id: 'stationlist'
    }];

    $scope.timeElapsed = 'alert alert-success';
    $scope.currentTab = 'regulation';
    $scope.preRequireRecalculate = false;
    $scope.calculateRegulation = true;
    $scope.selectedStep = "preselection";
    $scope.stepNumber = 1;

    $scope.activityId = $scope.getParam('activityId');
    $scope.editActivityId = $scope.getParam('editActivityId');
    $scope.parentActivityId = $scope.getParam('parentActivityId');

    if ($scope.editActivityId) {
        $scope.activityId = $scope.editActivityId;
    }

    $scope.activity = {
        dateCreated: null,
        id: null,
        preselection: {
            reductionSetting: '',
            discriminationCoefficientEnabled: "false",
            characteristicForMissingMeasurementJpaFwt: '',
            substituteValuePhotovoltaicFwt: null,
            substituteValueWindFwt: null,
            substituteValueBiogasFwt: null,
            characteristicForMissingMeasurementJpaEfr: '',
            substituteValuePhotovoltaicEfr: null,
            substituteValueWindEfr: null,
            substituteValueBiogasEfr: null
        },
        settings: {
            dateStarted: '',
            dateFinished: '',
            reasonOfReduction: '',
            requiredReductionPower: '',
            useWholeArea: false,
            subGeographicalRegions: {},
            transformerStations: {},
            description: '',
            practise: "false"
        },
        substationProposalList: []
    };

    if ($scope.parentActivityId) {

        $scope.activity.parentActivityJpaId = $scope.parentActivityId;
    }

    /*
     * Preselection Data
     */
    $scope.regulationSteps = {};

    $scope.preselectionForm = {};
    $scope.templates = [];
    $scope.selectedTemplate = null;
    $scope.saveTemplateName = '';

    $scope.localLang = {};

    /*
     * Usersettings Data
     */
    $scope.transformerStations = [];
    $scope.subGeographicalRegions = [];
    $scope.regulationReasons = [];
    //$scope.mailReasons = [];

    $scope.getTimeElapsed = function () {

        return $scope.timeElapsed;
    };

    $scope.changeTimerClass = function (classes) {
        $scope.timeElapsed = classes;
    };

    $scope.showHint = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'timeoutHint',
            controller: 'RecalculateModalController',
            resolve: {
                items: function () {
                    return [$scope.selectedTemplate, $scope.activity, $scope.templates];
                }
            }
        });
    };

    $scope.$on('timer-tick', function (event, args) {

        if (args.millis <= 900000 && args.millis > 450000) {

            $scope.$emit($scope.changeTimerClass('alert alert-warning'));

        } else if (args.millis <= 450000) {

            $scope.$emit($scope.changeTimerClass('alert alert-danger'));
        }

        if (args.millis === 0) {

            $scope.$emit($scope.showHint());
        }
    });

    /*
     * Preselection Functions
     */
    $scope.loadTemplateData = function (selectedTemplate) {

        if (selectedTemplate) {
            $scope.selectedTemplate = selectedTemplate.preselectionConfigurationJpa;
            $scope.activity.preselection.reductionSetting = selectedTemplate.preselectionConfigurationJpa.reductionSetting;
            $scope.activity.preselection.discriminationCoefficientEnabled = selectedTemplate.preselectionConfigurationJpa.discriminationCoefficientEnabled;
            $scope.activity.preselection.characteristicForMissingMeasurementFwt = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementFwt;
            $scope.activity.preselection.substituteValuePhotovoltaicFwt = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicFwt;
            $scope.activity.preselection.substituteValueWindFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueWindFwt;
            $scope.activity.preselection.substituteValueBiogasFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasFwt;
            $scope.activity.preselection.characteristicForMissingMeasurementEfr = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementEfr;
            $scope.activity.preselection.substituteValueWindEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueWindEfr;
            $scope.activity.preselection.substituteValuePhotovoltaicEfr = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicEfr;
            $scope.activity.preselection.substituteValueBiogasEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasEfr;
            $scope.activity.substationProposalList = selectedTemplate.substationJpaList;
        }
    };

    $scope.gotoOverview = function (id) {

        window.location.search = '';
    };

    $scope.preselectionFormSubmitted = false;
    $scope.gotoSettings = function (preselectionForm) {

        if (preselectionForm.$valid) {

            $scope.stepNumber = 2;
            $scope.selectedStep = "settings";

        } else {

            $scope.preselectionFormSubmitted = true;
        }

        return false;
    };

    $scope.saveAndReturn = function () {

        var postData = {
            "dateCreated": $scope.activity.dateCreated,
            "createdBy": $scope.activity.createdBy,
            "id": $scope.activityId,
            "parentActivityJpaId": $scope.parentActivityId,
            "dateStarted": $scope.activity.settings.dateStarted,
            "dateFinished": $scope.activity.settings.dateFinished,
            "description": $scope.activity.settings.description,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "practise": $scope.activity.settings.practise,
            'geographicalRegion': $scope.activity.settings.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselection.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselection.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselection.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselection.substituteValueBiogasEfr
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
            "timeout": 30000
        };

        if (postData.parentActivityJpaId && postData.activityId) {

            $http.put(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                window.location.search = ''; //?page=details&activityId=' + data.parentActivityJpaId

            }).error(function (data, status, headers, config) {
                $log.error('openk-eisman-portlet/rest/activity/');
            });

        } else {

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                window.location.search = '';//?page=details&activityId=' + data.id;

            }).error(function (data, status, headers, config) {
                $log.error('openk-eisman-portlet/rest/activity/');
            });
        }
    };

    $scope.openModal = function (preselectionForm) {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modalContent',
            controller: 'PreselectionModalController',
            resolve: {
                items: function () {
                    return [$scope.selectedTemplate, $scope.activity, $scope.templates];
                }
            }
        });
    };

    $scope.openModalConfirmProposal = function () {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modalContentConfirmPorposal',
            controller: 'ProposalModalController',
            resolve: {
                items: function () {
                    return [$scope.activity];
                }
            }
        });
    };

    /*
     * Usersettings Functions
     */
    $scope.gotoPreselection = function () {

        $scope.stepNumber = 1;
        $scope.selectedStep = "preselection";
        return false;
    };

    $scope.getPostData = function () {

        var data = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateStarted": $scope.activity.settings.dateStarted,
            "dateFinished": $scope.activity.settings.dateFinished,
            "description": $scope.activity.settings.description,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "practise": $scope.activity.settings.practise,
            'geographicalRegion': $scope.activity.settings.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselection.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselection.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselection.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselection.substituteValueBiogasEfr
            },
            "timeout": 30000
        };

        return data;
    };

    $scope.isNoValidTimeInterval = function (dateStarted, dateFinished) {
        alert("isNoValidTimeInterval: not defined");
        //return !dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {

        return !$scope.activity.settings.useWholeArea &&
            $scope.activity.settings.transformerStations.length === 0 &&
            $scope.activity.settings.subGeographicalRegions.length === 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid && !$scope.isNoValidTimeInterval($scope.activity.settings.dateStarted, $scope.activity.settings.dateFinished)) {

            $scope.activity.dateDiff = $scope.activity.settings.dateFinished - $scope.activity.settings.dateStarted;

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/activity/createreductionadvice", $scope.getPostData()).success(function (data) {

                var advice = [];
                var activity = {};

                if (data.id && data.parentActivityJpaId) {

                    advice = data.synchronousMachineJpaReducedList;
                    activity = data;

                    $scope.activity.id = data.id;
                    $scope.activity.parentActivityJpaId = data.parentActivityJpaId;
                    $scope.activity.substationProposalList = data.synchronousMachineJpaReducedList;

                } else {

                    advice = data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                    activity = data.childrenActivityJpaList[0];
                    activity.parentActivityJpaId = data.activityId;
                    $scope.activity.id = data.childrenActivityJpaList[0].id;
                    $scope.activity.parentActivityJpaId = data.id;
                    $scope.activity.substationProposalList = data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                }

                advice.forEach(function (value, key) {

                    //value.getCalculatedPower = parseInt((100 - value.reductionAdvice) * value.generatingUnitJpa.maxOperatingP.value) / 100;
                    value.getCalculatedPower = parseInt(value.generatorVoltageMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
                });

                $rootScope.$broadcast('replaceData', activity);
                $scope.activity.calculatedReductionAdvice = data;

                $scope.stepNumber = 3;
                $scope.selectedStep = "proposal";

                $rootScope.$broadcast('showSubstationProposalGrid', [], 'refresh');

            }).error(function (data, status, headers, config) {

                $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
                $log.error('Can not load /openk-eisman-portlet/rest/activity/createreductionadvice/');
            });

        } else {

            $scope.settingsFormSubmitted = true;
        }

        return false;
    };

    $scope.gotoConfirm = function () {

        $scope.selectedStep = "confirm";
        return false;
    };

    $scope.menueJumpTo = function (step, destination) {

        if ($scope.stepNumber === 3) {
            $scope.recalculate = false;
        }

        if ($scope.checkStepNumber(step)) {
            $scope.selectedStep = destination;
        }

        return false;
    };

    $scope.checkStepNumber = function (step) {
        var diff = step - $scope.stepNumber;
        if (diff <= 0) {
            return true;
        }
        return false;
    };

    $scope.checkForWholeAreaDisabling = function () {

        return $scope.activity.settings.subGeographicalRegions.length > 0 || $scope.activity.settings.transformerStations.length > 0;
    };

    $scope.checkForSubGeographicalRegionsDisabling = function () {

        return $scope.activity.settings.useWholeArea || $scope.activity.settings.transformerStations.length > 0;
    };

    $scope.checkForTransformerStationsDisabling = function () {

        return $scope.activity.settings.useWholeArea || $scope.activity.settings.subGeographicalRegions.length > 0;
    };

    $scope.checkForWholeAreaRequired = function () {

        return !($scope.activity.settings.subGeographicalRegions.length > 0 || $scope.activity.settings.transformerStations.length > 0);
    };

    $scope.checkForSubGeographicalRegionsRequired = function () {

        return !($scope.activity.settings.useWholeArea || $scope.activity.settings.transformerStations.length > 0);
    };

    $scope.checkForTransformerStationsRequired = function () {

        return !($scope.activity.settings.useWholeArea || $scope.activity.settings.subGeographicalRegions.length > 0);
    };

    if ($scope.editActivityId) {

        $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/activity/" + $scope.editActivityId, {

            "timeout": 30000

        }).success(function (data) {

            $scope.templates = data;

            $scope.activity.id = data.id;
            $scope.activity.parentActivityJpaId = data.parentActivityJpaId;
            $scope.activity.dateCreated = data.dateCreated;
            $scope.activity.createdBy = data.createdBy;
            $scope.activity.activityId = data.activityId;
            $scope.parentActivityJpaId = data.parentActivityJpaId;
            $scope.activity.preselection.reductionSetting = data.preselectionConfigurationJpa.reductionSetting;
            $scope.activity.preselection.discriminationCoefficientEnabled = data.preselectionConfigurationJpa.discriminationCoefficientEnabled;
            $scope.activity.preselection.characteristicForMissingMeasurementFwt = data.preselectionConfigurationJpa.characteristicForMissingMeasurementFwt;
            $scope.activity.preselection.substituteValuePhotovoltaicFwt = data.preselectionConfigurationJpa.substituteValuePhotovoltaicFwt;
            $scope.activity.preselection.substituteValueWindFwt = data.preselectionConfigurationJpa.substituteValueWindFwt;
            $scope.activity.preselection.substituteValueBiogasFwt = data.preselectionConfigurationJpa.substituteValueBiogasFwt;
            $scope.activity.preselection.characteristicForMissingMeasurementEfr = data.preselectionConfigurationJpa.characteristicForMissingMeasurementEfr;
            $scope.activity.preselection.substituteValuePhotovoltaicEfr = data.preselectionConfigurationJpa.substituteValuePhotovoltaicEfr;
            $scope.activity.preselection.substituteValueWindEfr = data.preselectionConfigurationJpa.substituteValueWindEfr;
            $scope.activity.preselection.substituteValueBiogasEfr = data.preselectionConfigurationJpa.substituteValueBiogasEfr;
            $scope.activity.settings.dateStarted = data.dateStarted;
            $scope.activity.settings.dateFinished = data.dateFinished;
            $scope.activity.dateDiff = $scope.activity.settings.dateFinished - $scope.activity.settings.dateStarted;
            $scope.activity.settings.reasonOfReduction = data.reasonOfReduction;
            $scope.activity.settings.requiredReductionPower = data.activePowerJpaToBeReduced.value;
            $scope.activity.settings.useWholeArea = data.geographicalRegion;
            $scope.activity.settings.description = data.description;

            if (data.practise) {

                $scope.activity.settings.practise = 'true';

            } else {

                $scope.activity.settings.practise = 'false';
            }

            $scope.activity.settings.subGeographicalRegions = data.subGeographicalRegionJpaList;
            $scope.activity.settings.transformerStations = data.substationJpaList;
            $scope.activity.substationProposalList = data.synchronousMachineJpaReducedList;

        }).error(function (data, status, headers, config) {

            $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
        });
    }

    /*
     * Global Functions
     */
    $rootScope.$on('requireRecalculate', function (event, args) {

        $scope.$broadcast('reCalculateAfterTimeout', [true]);
        return false;
    });

    $rootScope.$on('replaceData', function (event, args) {

        $scope.activity.createdBy = args.createdBy;
        $scope.activity.dateCreated = args.dateCreated;
        $scope.parentActivityId = args.parentActivityJpaId;
        $scope.activity.id = args.id;
        $scope.activityId = $scope.activity.id;

        $scope.activity.substationProposalList = args.synchronousMachineJpaReducedList;

        if ($scope.editActivityId) {

            $scope.editActivityId = $scope.activityId;
        }

        return false;
    });

    $rootScope.$on('refreshCalculationAdvice', function (event, args) {

        $scope.activity.substationProposalList = args;//synchronousMachineJpaReducedList;
    });

    $scope.onClickTab = function (tab) {

        $scope.currentTab = tab.id;
        return false;
    };

    $scope.nextPage = function (page) {

        $scope.selectedStep = page;
        return false;
    };

    $scope.isActiveTab = function (tabUrl) {

        return tabUrl === $scope.currentTab;
    };

    $rootScope.$on('resetPreselection', function (event, args) {

        if (args[0] === true) {
            $scope.selectedTemplate = args[1];

            for (var i = 0; i < $scope.templates.length; i++) {

                if ($scope.templates[i].id === args[1].id) {

                    $scope.templates[i] = args[1];
                    $scope.selectedTemplate = args[1];

                    break;
                }
            }

        } else {

            $scope.templates.push(args[1]);
        }
    });

    $rootScope.$on('displayError', function (event, msg) {

        /*var modalInstance = $modal.open({
         animation: true,
         templateUrl: 'errorHint',
         controller: 'DisplayErrorController',
         resolve: {
         items: function () {
         return [msg];
         }
         }
         });*/
    });

    /*
     Daten laden
     */
    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/preselection/", {
        "timeout": 30000
    }).success(function (data) {
        $scope.templates = data;
    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/reductionsettinglist/", {
        "timeout": 30000
    }).success(function (data) {
        $scope.regulationSteps = data;
    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/reasonofreductions/", {
        "timeout": 30000
    }).success(function (data) {
        $scope.regulationReasons = data;
    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/substation/lov/", {
        "timeout": 30000
    }).success(function (data) {

        $scope.transformerStations = data;

        if ($scope.activity.settings.transformerStations && $scope.transformerStations) {

            var tmpTicked = $scope.activity.settings.transformerStations;

            for (var i = 0; i < $scope.transformerStations.length; i++) {

                for (var j = 0; j < tmpTicked.length; j++) {

                    if ($scope.transformerStations[i].mRid === tmpTicked[j].mRid) {
                        $scope.transformerStations[i].ticked = true;
                        break;
                    }
                }
            }
        }
    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/reasonofreductions/", {
        "timeout": 30000,
        "cache": true
    }).success(function (data) {

        $scope.mailReasons = data;
    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/subgeographicalregion/lov/", {
        "timeout": 30000,
        "cache": true
    }).success(function (data) {

        $scope.subGeographicalRegions = data;

        if ($scope.activity.settings.subGeographicalRegions && $scope.subGeographicalRegions) {

            var tmpTicked = $scope.activity.settings.subGeographicalRegions;

            for (var i = 0; i < $scope.subGeographicalRegions.length; i++) {

                for (var j = 0; j < tmpTicked.length; j++) {

                    if ($scope.subGeographicalRegions[i].mRid === tmpTicked[j].mRid) {
                        $scope.subGeographicalRegions[i].ticked = true;
                        break;
                    }
                }
            }
        }

    }).error(function (data, status, headers, config) {
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/timeintervaldataexpired", {
        "timeout": 30000,
        "cache": true
    }).success(function (data) {
        $scope.timerTick = data;
    }).error(function (data, status, headers, config) {
        $scope.timerTick = 700;
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/hysteresis", {
        "timeout": 30000,
        "cache": true
    }).success(function (data) {
        $scope.hysteresis = data;
    }).error(function (data, status, headers, config) {
        $scope.timerTick = 700;
        $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
    });

}]);
