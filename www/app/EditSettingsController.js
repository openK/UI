app.controller('EditSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

    $scope.activity = activityService.activity();
    if ($scope.activity.pointOfInjectionType === 'GEOGRAPHICALREGION') {
        $scope.activity.useWholeArea = true;
    }

    $scope.parentActivityId = activityService.currentParentActivityId();
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
            newStartDate = new Date(newStartDate.setMinutes(minutes - 1, 0, 0));
        } else {
            newStartDate = new Date(newStartDate.setMinutes(minutes - 1, 0, 0));
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

    $('#datestarted').on('apply.daterangepicker', function (ev, picker) {
        var start = new Date(picker.startDate);
        var end = new Date($('#datefinished').data('daterangepicker').startDate);
        if (start >= end) {
            var quarters = parseInt(start.getMinutes() / 15);
            var minutes = quarters * 15 + 30;
            var hours = parseInt(minutes / 60);
            var newEnd = start;
            if (hours) {
                newEnd = new Date(newEnd.setHours(newStartDate.getHours() + 1));
                minutes = minutes % 60;
                newEnd = new Date(newEnd.setMinutes(minutes, 0, 0));
            } else {
                newEnd = new Date(newEnd.setMinutes(minutes, 0, 0));
            }
            $('#datefinished').daterangepicker({
                singleDatePicker: true,
                timePicker12Hour: false,
                timePicker: true,
                timePickerIncrement: 15,
                startDate: newEnd,
                minDate: start,
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


    $scope.dateStarted = $filter('date')(new Date(newStartDate), 'dd.MM.yyyy HH:mm');
    $scope.dateFinished = $filter('date')(new Date(newDateFinished), 'dd.MM.yyyy HH:mm');
    $scope.activityConfigData = activityService.activityConfigData().activity;

    if ($stateParams.taskId) {

        $scope.data.forEach(function (a) {
            if (a.id == $stateParams.taskId)
                $scope.currentParentActivity = a;
        });
    }

    $scope.saveAndReturn = function () {
        $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
        $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
        var dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var postData = {
            "dateCreated": dateCreated,
            "createdBy": $scope.activity.createdBy,
            "id": $scope.activity.activityId,
            "parentActivityJpaId": $scope.parentActivityId,
            "userSettingsJpa": {
                "dateStarted": $scope.activity.dateStarted,
                "dateFinished": $scope.activity.dateFinished,
                "geographicalRegion": $scope.activity.useWholeArea,
                "reasonOfReduction": $scope.activity.reasonOfReduction,
                "practise": $scope.activity.practise,
                "description": $scope.activity.description
            },
            "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
            "substationJpaList": $scope.activity.transformerStations,
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

    $scope.getPostData = function () {

        $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
        $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
        var data = {
            "userSettingsJpa": {
                "dateStarted": $scope.activity.dateStarted,
                "dateFinished": $scope.activity.dateFinished,
                "geographicalRegion": $scope.activity.useWholeArea,
                "reasonOfReduction": $scope.activity.reasonOfReduction,
                "practise": $scope.activity.practise,
                "description": $scope.activity.description
            },
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.reductionValue,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
            "substationJpaList": $scope.activity.transformerStations,
            "parentActivityJpaId": $scope.parentActivityId,
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
        };

        return data;
    };

    $scope.isValidTimeInterval = function (dateStarted, dateFinished) {
        return dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {
        return $scope.activity.pointOfInjectionType === 1 ||
            $scope.activity.pointOfInjectionList.length > 0;
    };


    $scope.gotoStationList = function (settingsForm) {

        if (settingsForm.$valid && $scope.isValidTimeInterval($scope.dateStarted, $scope.dateFinished)) {

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

                $state.go('EditRegulation.EditProposal.Main');
            }).error(function (data, status, headers, config) {
                $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
                $log.error('Can not load /openk-eisman-portlet/rest/activity/createreductionadvice/');
            });

        } else {
            $scope.FormSubmitted = true;
        }
        return false;
    };

    $scope.checkForWholeAreaDisabling = function () {

        return ($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0) || ($scope.activity.transformerStations && $scope.activity.transformerStations.length > 0);
    };

    $scope.checkForSubGeographicalRegionsDisabling = function () {

        return $scope.activity.useWholeArea || ($scope.activity.transformerStations && $scope.activity.transformerStations.length > 0);
    };

    $scope.checkForTransformerStationsDisabling = function () {

        return $scope.activity.useWholeArea || ($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0);
    };

    $scope.checkForWholeAreaRequired = function () {

        return !(($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0) || ($scope.activity.transformerStations && $scope.activity.transformerStations.length > 0));
    };

    $scope.checkForTransformerStationsRequired = function () {

        return !($scope.activity.useWholeArea || ($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0));
    };
}]);
