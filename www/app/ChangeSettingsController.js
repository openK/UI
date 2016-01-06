app.controller('ChangeSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    $scope.activity = activityService.activity();
    if ($scope.activity.pointOfInjectionType === 'GEOGRAPHICALREGION') {
        $scope.activity.useWholeArea = true;
    }
    if ($scope.activity.pointOfInjectionType && $scope.activity.pointOfInjectionType.length > 0)
        $scope.activity.pointOfInjectionTypeString = $translate.instant($scope.activity.pointOfInjectionType);

    $scope.activity.reductionPositive = true;

    // configure the new startDate and finsheDate...
    var newStartDate = new Date(new Date($scope.activity.dateStarted).setSeconds(0));
    var now = new Date(new Date($.now()).setSeconds(120));
    if (newStartDate < now) {
        now = new Date($.now());
        newStartDate = new Date(now.setMinutes(parseInt((now.getMinutes() + 15) / 15) * 15));
    }
    var newFinishedDate = new Date(new Date($scope.activity.dateFinished).setSeconds(0));
    if (newStartDate > newFinishedDate) {
        newFinishedDate = new Date(new Date(newStartDate).setMinutes(parseInt((newStartDate.getMinutes() + 15) / 15) * 15));
    }
    now = new Date($.now());
    $('#datestarted').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePicker: true,
        timePickerIncrement: 1,
        startDate: newStartDate,
        minDate: new Date(now.setMinutes(now.getMinutes() + 1)),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            cancelLabel: 'Abbrechen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

    $('#datestarted').on('apply.daterangepicker', function (ev, picker) {
        var start = new Date(picker.startDate);
        var end = new Date($('#datefinished').data('daterangepicker').startDate);
        if (start >= end) {
            var newMinFinishDate = new Date(start);
            var newEnd = new Date(new Date(start.getTime()).setMinutes(parseInt(((start.getMinutes() + 30) / 15) * 15)));
            newMinFinishDate = new Date(newMinFinishDate.setMinutes(newMinFinishDate.getMinutes() + 1));
            $('#datefinished').daterangepicker({
                singleDatePicker: true,
                timePicker24Hour: true,
                timePicker: true,
                timePickerIncrement: 1,
                startDate: newEnd,
                minDate: newMinFinishDate,
                locale: {
                    format: 'DD.MM.YYYY HH:mm',
                    applyLabel: '&Uuml;bernehmen',
                    cancelLabel: 'Abbrechen',
                    daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                    monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    firstDay: 1
                }
            });
        }
    });

    var minFinishDate = new Date(newStartDate);
    minFinishDate = new Date(minFinishDate.setMinutes(minFinishDate.getMinutes() + 1));
    $('#datefinished').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePicker: true,
        timePickerIncrement: 1,
        startDate: newFinishedDate,
        minDate: minFinishDate,
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            cancelLabel: 'Abbrechen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });


    $scope.dateStarted = $filter('date')(new Date(newStartDate), 'dd.MM.yyyy HH:mm');
    $scope.dateFinished = $filter('date')(new Date(newFinishedDate), 'dd.MM.yyyy HH:mm');
    $scope.activityConfigData = activityService.activityConfigData().activity;

    if ($stateParams.taskId) {

        $scope.data.forEach(function (a) {
            if (a.id == $stateParams.taskId)
                $scope.currentParentActivity = a;
        });
    }

    $scope.isValidTimeInterval = function (dateStarted, dateFinished) {
        return dateStarted >= new Date($.now()) || dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {
        return $scope.activity.pointOfInjectionType === 1 ||
            $scope.activity.pointOfInjectionList.length > 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid) {

            $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
            $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
            var data = {
                "id": null,
                "parentActivityJpaId": activityService.currentParentActivityId(),
                "dateStarted": $scope.activity.dateStarted,
                "dateFinished": $scope.activity.dateFinished,
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
                //if (result.data.id && result.data.parentActivityJpaId) {
                if (result.data.parentActivityJpaId) {

                    advice = result.data.synchronousMachineJpaReducedList;
                    $scope.activity.id = result.data.id;
                    $scope.activity.parentActivityJpaId = result.data.parentActivityJpaId;
                    $scope.activity.activePowerJpaToBeReduced = { value: result.data.activePowerJpaToBeReduced.value };
                    $scope.activity.substationProposalList = result.data.synchronousMachineJpaReducedList;

                } else {
                    advice = result.data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                    result.data.childrenActivityJpaList[0].parentActivityJpaId = result.data.activityId;
                    //$scope.activity.id = result.data.childrenActivityJpaList[0].id;
                    $scope.activity.parentActivityJpaId = result.data.id;
                    $scope.activity.substationProposalList = result.data.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
                }
                advice.forEach(function (value) {
                    value.getCalculatedPower = parseInt(value.generatorPowerMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
                });

                $scope.activity.calculatedReductionAdvice = result.data;

                $state.go('ChangeRegulation.ChangeProposal.Main');
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
