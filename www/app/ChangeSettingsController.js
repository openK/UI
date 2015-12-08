app.controller('ChangeSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    $scope.activity = activityService.newActivity();
    //$scope.activity = activityService.activity();
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
            newStartDate = new Date(newStartDate.setMinutes(minutes-1, 0, 0));
        } else {
            newStartDate = new Date(newStartDate.setMinutes(minutes-1, 0, 0));
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
            "reasonOfReduction": $scope.activity.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
            "substationJpaList": $scope.activity.transformerStations,
            "practise": $scope.activity.practise,
            'geographicalRegion': $scope.activity.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselectionConfigurationDto.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselectionConfigurationDto.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselectionConfigurationDto.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselectionConfigurationDto.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselectionConfigurationDto.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselectionConfigurationDto.substituteValueBiogasEfr
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

    $scope.isValidTimeInterval = function (dateStarted, dateFinished) {
        return dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {
        return $scope.activity.pointOfInjectionType === 1 ||
            $scope.activity.pointOfInjectionList.length > 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid && $scope.isValidTimeInterval($scope.activity.dateStarted, $scope.activity.dateFinished)) {

            var dateStarted = dateService.formatDateForBackend($scope.activity.dateStarted);
            var dateFinished = dateService.formatDateForBackend($scope.activity.dateFinished);
            var data = {
                "id": null,
                "parentActivityJpaId": activityService.currentParentActivityId(),
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "reductionValue": $scope.activity.reductionValue,
                "reasonOfReduction": $scope.activity.reasonOfReduction,
                "practise": $scope.activity.practise,
                "pointOfInjectionType": $scope.activity.pointOfInjectionType,
                "pointOfInjectionList": $scope.activity.pointOfInjectionList,
                "description": $scope.activity.description,
                "preselectionConfigurationDto": {
                    "reductionSetting": $scope.activity.preselectionConfigurationDto.reductionSetting,
                    "discriminationCoefficientEnabled": $scope.activity.preselectionConfigurationDto.discriminationCoefficientEnabled,
                    "characteristicForMissingMeasurementFwt": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementFwt,
                    "characteristicForMissingMeasurementEfr": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementEfr,
                    "substituteValueWindFwt": $scope.activity.preselectionConfigurationDto.substituteValueWindFwt,
                    "substituteValuePhotovoltaicFwt": $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicFwt,
                    "substituteValueBiogasFwt": $scope.activity.preselectionConfigurationDto.substituteValueBiogasFwt,
                    'substituteValueWindEfr': $scope.activity.preselectionConfigurationDto.substituteValueWindEfr,
                    'substituteValuePhotovoltaicEfr': $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicEfr,
                    'substituteValueBiogasEfr': $scope.activity.preselectionConfigurationDto.substituteValueBiogasEfr
                }
            };

            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/createreductionadviceforaction", data).then(function (result) {

                var advice;
                if (result.data.id && result.data.parentActivityJpaId) {

                    advice = result.data.synchronousMachineJpaReducedList;
                    $scope.activity.id = result.data.id;
                    $scope.activity.parentActivityJpaId = result.data.parentActivityJpaId;
                    $scope.activity.substationProposalList = result.data.synchronousMachineJpaReducedList;

                } else {
                    advice = result.data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                    result.data.childrenActivityJpaList[0].parentActivityJpaId = result.data.activityId;
                    $scope.activity.id = result.data.childrenActivityJpaList[0].id;
                    $scope.activity.parentActivityJpaId = result.data.id;
                    $scope.activity.substationProposalList = result.data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                }
                advice.forEach(function (value) {
                    value.getCalculatedPower = parseInt(value.generatorVoltageMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
                });

                $scope.activity.calculatedReductionAdvice = result.data;

                $state.go('Regulation.CreateProposal.Main');
            }, function (data, status, headers, config) {
                $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
                $log.error('Can not load /openk-eisman-portlet/rest/activity/createreductionadvice/');
            });

        } else {

            $scope.settingsFormSubmitted = true;
        }

        return false;
    };

}]);
