app.controller('CreateSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    $scope.activity = activityService.activity();

    // configure the new startDate and finsheDate...
    var now = new Date($.now());
    var quarters = parseInt(now.getMinutes() / 15);
    var minutes = quarters * 15 + 30;
    var hours = parseInt(minutes / 60);
    var newStartDate = now;
    var newDateFinished = now;
    if (hours) {
        newStartDate = new Date(newStartDate.setHours(newStartDate.getHours() + 1));
        minutes = minutes % 60;
        newStartDate = new Date(newStartDate.setMinutes(minutes, 0, 0));
    } else {
        newStartDate = new Date(newStartDate.setMinutes(minutes, 0, 0));
    }
    newDateFinished = new Date(newStartDate.getTime());
    newDateFinished = new Date(newDateFinished.setMinutes(newDateFinished.getMinutes() + 30, 0, 0));

    $('#datestarted').daterangepicker({
        singleDatePicker: true,
        timePicker12Hour: false,
        timePicker: true,
        timePickerIncrement: 15,
        startDate: newStartDate,
        minDate: $.now(),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

    $('#datefinished').daterangepicker({
        singleDatePicker: true,
        timePicker12Hour: false,
        timePicker: true,
        timePickerIncrement: 15,
        startDate: newDateFinished,
        minDate: $.now(),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

    $scope.activityConfigData = activityService.activityConfigData().activity;
    if ($stateParams.taskId) {

        $scope.data.forEach(function (a) {
            if (a.id == $stateParams.taskId)
                $scope.currentParentActivity = a;
        });
    }
    $scope.saveAndReturn = function () {
        var dateStarted = dateService.formatDateForBackend($scope.activity.settings.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.settings.dateFinished);
        var dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var postData = {
            "dateCreated": dateCreated,
            "createdBy": $scope.activity.createdBy,
            "id": $scope.activity.activityId,
            "parentActivityJpaId": $scope.parentActivityId,
            "userSettingsJpa": {
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "geographicalRegion": $scope.activity.settings.useWholeArea,
                "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
                "practise": $scope.activity.settings.practise,
                "description": $scope.activity.settings.description
            },
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
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

            $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                $state.go('state1',{show: 'Aktiv'});

            }).error(function (data, status, headers, config) {
                $log.error('openk-eisman-portlet/rest/activity/');
            });

        } else {

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                $state.go('state1',{show: 'Aktiv'});

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
        if ($scope.activity.settings.practise) {
            $scope.activity.settings.practise = true;
        } else {
            $scope.activity.settings.practise = false;
        }
        var data = {
            "userSettingsJpa": {
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "geographicalRegion": $scope.activity.settings.useWholeArea,
                "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
                "practise": $scope.activity.settings.practise,
                "description": $scope.activity.settings.description
            },
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
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

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/createreductionadvice", $scope.getPostData()).success(function (data) {

                var advice;
                if (data.id && data.parentActivityJpaId) {

                    advice = data.synchronousMachineJpaReducedList;
                    $scope.activity.id = data.id;
                    $scope.activity.parentActivityJpaId = data.parentActivityJpaId;
                    $scope.activity.substationProposalList = data.synchronousMachineJpaReducedList;

                } else {
                    advice = data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                    data.childrenActivityJpaList[0].parentActivityJpaId = data.activityId;
                    $scope.activity.id = data.childrenActivityJpaList[0].id;
                    $scope.activity.parentActivityJpaId = data.id;
                    $scope.activity.substationProposalList = data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                }
                advice.forEach(function (value) {
                    value.getCalculatedPower = parseInt(value.generatorPowerMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
                });

                $scope.activity.calculatedReductionAdvice = data;

                $state.go('Regulation.CreateProposal.Main');
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

}]);
