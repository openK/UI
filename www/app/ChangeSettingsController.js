app.controller('ChangeSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    //$scope.activity = activityService.newActivity();
    $scope.activity = activityService.activity();
    // get current time as date...
    var now = new Date($.now());
    // get activity start date as date...
    var newStartDate = new Date($scope.activity.dateStarted);
    // check the time gap between now and activity startDateTime...
    var distance = newStartDate.getTime() - now.getTime();
    // if the time gap is less than 15 minutes set the gap to more than 15 minutes but less or equal to 30 minutes...
    if (distance > 0 && new Date(distance).getMinutes() < 15) {
        var quaters = parseInt(now.getMinutes() / 15);
        var minutes = quaters * 15 + 30;
        var hours = parseInt(minutes / 60);
        if (hours) {
            newStartDate = new Date(newStartDate.setHours(newStartDate.getHours() + 1));
            minutes = minutes % 60;
            newStartDate = newStartDate.setMinutes(minutes-1, 0, 0);
        } else {
            newStartDate = newStartDate.setMinutes(minutes-1, 0, 0);
        }
    }

    $scope.startDateEdit = newStartDate;
    var newDateFinished = new Date(newStartDate.getTime());
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


    $scope.activity.dateStarted = $filter('date')(new Date(newStartDate), 'dd.MM.yyyy HH:mm');
    $scope.activity.dateFinished = $filter('date')(new Date($scope.activity.dateFinished), 'dd.MM.yyyy HH:mm');
    $scope.activityConfigData = activityService.activityConfigData().activity;
    $scope.activity.activePowerJpaToBeReduced.additionalReductionPowerValue = { positiv: true, value: 0 };

    if ($stateParams.taskId) {

        $scope.data.forEach(function(a) {
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
        //var startDateEdit = $('#datestarted').data('daterangepicker').startDate.toISOString();
        //var startDateEdit = $('#datefinished').data('daterangepicker').startDate.toISOString();
        var dateStarted = dateService.formatDateForBackend($scope.activity.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.dateFinished);
        var data = {
            "id": $scope.activityId,
            "dateStarted": dateStarted,
            "dateFinished": dateFinished,
            //"parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "description": $scope.activity.description,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
            "substationJpaList": $scope.activity.transformerStations,
            "practise": $scope.activity.practise,
            'geographicalRegion': $scope.activity.useWholeArea,
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

        return !$scope.activity.useWholeArea &&
            $scope.activity.transformerStations.length === 0 &&
            $scope.activity.subGeographicalRegions.length === 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid && $scope.isValidTimeInterval($scope.activity.dateStarted, $scope.activity.dateFinished)) {

            $scope.activity.dateDiff = dateService.getDateDiff($scope.activity.dateStarted, $scope.activity.dateFinished);

            var data = {
                "id": null,
                "parentActivityJpaId": activityService.currentParentActivityId(),
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "reductionValue": $scope.activity.settings.requiredReductionPower,
                "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
                "practise": $scope.activity.settings.practise,
                "pointOfInjectionType": $scope.activity.settings.useWholeArea ? 0 : 1,
                "pointOfInjectionList": pointOfInjectionList,
                "description": $scope.activity.settings.description,
                "preselectionConfigurationDto": {
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
                }
            };

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/createreductionadviceforaction", data).success(function (data) {

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
                    value.getCalculatedPower = parseInt(value.generatorVoltageMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
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

}]);
