app.controller('CreateSettingsController', ['$scope', '$state', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    $scope.activity = activityService.activity();
    $scope.activityConfigData = activityService.activityConfigData();

    $scope.regulationSteps = $scope.activityConfigData.regulationSteps;
    $scope.templates = $scope.activityConfigData.templates;
    $scope.transformerStations = $scope.activityConfigData.transformerStations;
    $scope.subGeographicalRegions = $scope.activityConfigData.subGeographicalRegions;
    $scope.regulationReasons = $scope.activityConfigData.regulationReasons;

    $scope.saveAndReturn = function () {
        var dateStarted = dateService.formatDateForBackend($scope.activity.settings.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.settings.dateFinished);
        var dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var postData = {
            "dateCreated": dateCreated,
            "createdBy": $scope.activity.createdBy,
            "id": $scope.activity.activityId,
            "parentActivityJpaId": $scope.parentActivityId,
            "dateStarted": dateStarted,
            "dateFinished": dateFinished,
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

                $state.go('state1');

            }).error(function (data, status, headers, config) {
                $log.error('openk-eisman-portlet/rest/activity/');
            });

        } else {

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL()+"/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                $state.go('state1');

            }).error(function (data, status, headers, config) {
                $log.error('openk-eisman-portlet/rest/activity/');
            });
        }
    };

    /*
     * Usersettings Functions
     */
    $scope.getPostData = function () {

        var dateStarted = dateService.formatDateForBackend($scope.activity.settings.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.settings.dateFinished);
        var data = {
            "id": $scope.activityId,
            "dateStarted": dateStarted,
            "dateFinished": dateFinished,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
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

    $scope.isValidTimeInterval = function (dateStarted, dateFinished) {
        return dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {

        return !$scope.activity.settings.useWholeArea &&
            $scope.activity.settings.transformerStations.length === 0 &&
            $scope.activity.settings.subGeographicalRegions.length === 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid && $scope.isValidTimeInterval($scope.activity.settings.dateStarted, $scope.activity.settings.dateFinished)) {

            $scope.activity.dateDiff = dateService.getDateDiff($scope.activity.settings.dateStarted, $scope.activity.settings.dateFinished);

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

                $scope.activity.calculatedReductionAdvice = data;

                activityService.activity($scope.activity);

                $state.go('Regulation.CreateProposal.Main');
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
            $scope.activity.settings.dateStarted = dateService.formateDateForClient(data.dateStarted);
            $scope.activity.settings.dateFinished = dateService.formateDateForClient(data.dateFinished);
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


}]);
