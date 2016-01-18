app.controller('CreateSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', 'modalServiceNew', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService, modalServiceNew) {

    $scope.activity = activityService.childActivity();
    $scope.$parent.mytimer = false;
    $scope.IsInChangeMode = $state.current.name.indexOf('Change') >= 0 ? true: false;
    $scope.IsInEditMode = $state.current.name.indexOf('Edit') >= 0 ? true : false;
    $scope.activityConfigData = activityService.activityConfigData();
    $scope.activity.reductionPositive = true;
    if ($rootScope.mode === 'edit' || $rootScope.mode === 'add') {
        $scope.activity.parentActivityJpaId = activityService.currentParentActivityId();
    }

    if ($rootScope.mode === 'add') {
        $scope.activity.id = null;
    }

    if ($rootScope.CanNavigateToCreateProposal === true) {
        $scope.settingsFormSubmitted = true;
    }

    if ($scope.activity.pointOfInjectionType === 'GEOGRAPHICALREGION') {
        $scope.activity.useWholeArea = true;
    }

    if ($scope.activity.pointOfInjectionType === 'SUBSTATION' && $scope.activity.pointOfInjectionList) {
        $scope.activity.transformerStations = [];
        $scope.activity.pointOfInjectionList.forEach(function (name) {
            $scope.activityConfigData.transformerStations.forEach(function (station) {
                if (station.name === name) {
                    station.selected = true;
                    station.ticked = true;
                }
            });
        })
    }

    if ($scope.activity.pointOfInjectionType === 'SUBGEOGRAPHICALREGION' && $scope.activity.pointOfInjectionList) {
        $scope.activity.subGeographicalRegions = [];
        $scope.activity.pointOfInjectionList.forEach(function (name) {
            $scope.activityConfigData.subGeographicalRegions.forEach(function (station) {
                if (station.name === name) {
                    station.selected = true;
                    station.ticked = true;
                }
            });
        })
    }

    $scope.$watch('activity.transformerStations', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        if (newValue && newValue.length > 0) {
            $scope.activity.pointOfInjectionType = 'SUBSTATION';
            $scope.activity.useWholeArea = false;
        } else {
            if ($scope.activity.subGeographicalRegions.length == 0) {
                $scope.activity.useWholeArea = true;
            }
        }
    }, true);

    $scope.$watch('activity.subGeographicalRegions', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        if (newValue && newValue.length > 0) {
            $scope.activity.pointOfInjectionType = 'SUBGEOGRAPHICALREGION';
            $scope.activity.useWholeArea = false;
        } else {
            if ($scope.activity.transformerStations.length == 0) {
                $scope.activity.useWholeArea = true;
            }
        }
    }, true);

    $scope.$watch('activity.useWholeArea', function (newValue, oldValue) {
        if (newValue == oldValue) {
            return;
        }
        if (newValue) {
            $scope.activity.pointOfInjectionType = 'GEOGRAPHICALREGION';
            $scope.activity.transformerStations = [];
            $scope.activity.subGeographicalRegions = [];
        }
    }, true);

    $scope.$watch('settingsForm.$invalid', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        $rootScope.settingsFormInValid = newValue;
    });

    // configure the new startDate and finsheDate...
    var now = new Date($.now());
    var dateStarted = new Date(now.setMinutes(parseInt((now.getMinutes() + 30) / 15) * 15))
    var dateFinished = new Date(new Date(dateStarted).setMinutes(dateStarted.getMinutes() + 30, 0, 0));
    if ($scope.activity.dateStarted) {
        var tempDateStarted = new Date($scope.activity.dateStarted);
        now = new Date($.now());
        if (tempDateStarted > now) {
            dateStarted = tempDateStarted;
        }
        var tempdateFinished = new Date($scope.activity.dateFinished);
        if (tempdateFinished > dateStarted) {
            dateFinished = tempdateFinished;
        }
    }

    $scope.dateStarted = $filter('date') (dateStarted, 'dd.MM.yyyy HH:mm');
    $scope.dateFinished = $filter('date') (dateFinished, 'dd.MM.yyyy HH:mm');


    var now = new Date($.now());
    $('#datestarted').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePicker: true,
        timePickerIncrement: 1,
        startDate: new Date(dateStarted),
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
        // if start date changes adjust end date if necessary!!!!
        // get the current end date...
        var end = new Date($('#datefinished').data('daterangepicker').startDate);
        // get the current start date...
        var start = new Date(picker.startDate);
        // minimum end date is always one minute past start date...
        var minEnd = new Date(new Date(start).setMinutes(start.getMinutes() + 1));
        // add 30 minutes to start date if the end date is below the start date...
        if (start >= end) {
            end = new Date(new Date(start).setMinutes(start.getMinutes() + 30));
        }
        $('#datefinished').daterangepicker({
            singleDatePicker: true,
            timePicker24Hour: true,
            timePicker: true,
            timePickerIncrement: 1,
            startDate: end,
            minDate: minEnd,
            locale: {
                format: 'DD.MM.YYYY HH:mm',
                applyLabel: '&Uuml;bernehmen',
                cancelLabel: 'Abbrechen',
                daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                firstDay: 1
            }
        });
    });

    $('#datefinished').daterangepicker({
        singleDatePicker: true,
        timePicker24Hour: true,
        timePicker: true,
        timePickerIncrement: 1,
        startDate: new Date(dateFinished),
        minDate: new Date(new Date(dateStarted).setMinutes(dateStarted.getMinutes() + 1)),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            cancelLabel: 'Abbrechen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

    $scope.saveAndReturn = function (settingsForm) {

        if (settingsForm.$valid && $scope.isValidTimeInterval($scope.dateStarted, $scope.dateFinished)) {
            $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
            $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
            $scope.activity.dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
            var postData = {
                "dateCreated": $scope.activity.dateCreated,
                "createdBy": $scope.activity.createdBy,
                "id": $scope.activity.activityId,
                "parentActivityJpaId": $scope.activity.parentActivityJpaId,
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
                "preselectionName": "",
                "preselectionConfigurationJpa": {
                    "reductionSetting": $scope.activity.reductionSetting,
                    "discriminationCoefficientEnabled": $scope.activity.discriminationCoefficientEnabled,
                    "characteristicForMissingMeasurementFwt": $scope.activity.characteristicForMissingMeasurementFwt,
                    "characteristicForMissingMeasurementEfr": $scope.activity.characteristicForMissingMeasurementEfr,
                    "substituteValueWindFwt": $scope.activity.substituteValueWindFwt,
                    "substituteValuePhotovoltaicFwt": $scope.activity.substituteValuePhotovoltaicFwt,
                    "substituteValueBiogasFwt": $scope.activity.substituteValueBiogasFwt,
                    'substituteValueWindEfr': $scope.activity.substituteValueWindEfr,
                    'substituteValuePhotovoltaicEfr': $scope.activity.substituteValuePhotovoltaicEfr,
                    'substituteValueBiogasEfr': $scope.activity.substituteValueBiogasEfr
                },
                'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
                "timeout": 30000
            };

            if (postData.parentActivityJpaId && postData.id) {

                $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).then(function (result) {

                    $state.go('state1', { show: 'Aktiv' });

                }, function (error) {
                    modalServiceNew.showErrorDialog(error).then(function () {
                        $state.go('state1', { show: 'Aktiv' });
                    });
                });

            } else {

                $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).then(function (result) {

                    $state.go('state1', { show: 'Aktiv' });

                }, function (error) {
                    modalServiceNew.showErrorDialog(error).then(function () {
                        $state.go('state1', { show: 'Aktiv' });
                    });
                });
            }
        } else {
            $scope.settingsFormSubmitted = true;
        }
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
        if (settingsForm.$valid) {
            $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
            $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
            $scope.activity.dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
            var url = Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/createreductionadvice';
            if ($scope.mode == 'add') {
                var data = {
                    "id": $scope.activity.id,
                    "parentActivityJpaId": $scope.activity.parentActivityJpaId,
                    "dateStarted": $scope.activity.dateStarted,
                    "dateFinished": $scope.activity.dateFinished,
                    "reductionValue": $scope.activity.reductionValue,
                    "reasonOfReduction": $scope.activity.reasonOfReduction,
                    "practise": $scope.activity.practise,
                    "pointOfInjectionType": $scope.activity.pointOfInjectionType,
                    "pointOfInjectionList": $scope.activity.pointOfInjectionList,
                    "description": $scope.activity.description,
                    "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
                    "substationJpaList": $scope.activity.transformerStations,
                    "preselectionConfigurationDto": {
                        "reductionSetting": $scope.activity.reductionSetting,
                        "discriminationCoefficientEnabled": $scope.activity.discriminationCoefficientEnabled,
                        "characteristicForMissingMeasurementFwt": $scope.activity.characteristicForMissingMeasurementFwt,
                        "characteristicForMissingMeasurementEfr": $scope.activity.characteristicForMissingMeasurementEfr,
                        "substituteValueWindFwt": $scope.activity.substituteValueWindFwt,
                        "substituteValuePhotovoltaicFwt": $scope.activity.substituteValuePhotovoltaicFwt,
                        "substituteValueBiogasFwt": $scope.activity.substituteValueBiogasFwt,
                        'substituteValueWindEfr': $scope.activity.substituteValueWindEfr,
                        'substituteValuePhotovoltaicEfr': $scope.activity.substituteValuePhotovoltaicEfr,
                        'substituteValueBiogasEfr': $scope.activity.substituteValueBiogasEfr
                    }
                };

                url += 'foraction'

            } else {
                var data = {
                    "id": $scope.activity.id,
                    "parentActivityJpaId": $scope.activity.parentActivityJpaId,
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
                    "preselectionName": "",
                    "preselectionConfigurationJpa": {
                        "reductionSetting": $scope.activity.reductionSetting,
                        "discriminationCoefficientEnabled": $scope.activity.discriminationCoefficientEnabled,
                        "characteristicForMissingMeasurementFwt": $scope.activity.characteristicForMissingMeasurementFwt,
                        "characteristicForMissingMeasurementEfr": $scope.activity.characteristicForMissingMeasurementEfr,
                        "substituteValueWindFwt": $scope.activity.substituteValueWindFwt,
                        "substituteValuePhotovoltaicFwt": $scope.activity.substituteValuePhotovoltaicFwt,
                        "substituteValueBiogasFwt": $scope.activity.substituteValueBiogasFwt,
                        'substituteValueWindEfr': $scope.activity.substituteValueWindEfr,
                        'substituteValuePhotovoltaicEfr': $scope.activity.substituteValuePhotovoltaicEfr,
                        'substituteValueBiogasEfr': $scope.activity.substituteValueBiogasEfr
                    },
                };
            }
            $http.post(url, data).then(function (result) {
                var advice = result.data.synchronousMachineJpaReducedList;
                if (result.data.id && result.data.parentActivityJpaId) {
                    $scope.activity.id = result.data.id;
                    $scope.activity.parentActivityJpaId = result.data.parentActivityJpaId;
                    $scope.activity.activePowerJpaToBeReduced = { value: result.data.activePowerJpaToBeReduced.value };
                    $scope.activity.substationProposalList = result.data.synchronousMachineJpaReducedList;

                } else {
                    result.data.id = $scope.activity.id;
                    result.data.parentActivityJpaId = $scope.activity.parentActivityJpaId;
                    $scope.activity.substationProposalList = result.data.synchronousMachineJpaReducedList;
                }
                advice.forEach(function (value) {
                    value.getCalculatedPower = parseInt(value.generatorPowerMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
                });

                $scope.activity.calculatedReductionAdvice = result.data;
                $scope.activity.calculatedReductionAdvice.dateStarted = $scope.activity.dateStarted;
                $scope.activity.calculatedReductionAdvice.dateFinished = $scope.activity.dateFinished;
                $state.go('Regulation.CreateProposal.Main');
            }, function (error) {
                modalServiceNew.showErrorDialog(error).then(function () {
                    $state.go('state1', {
                        show: 'Aktiv'
                    });
                });
            });

        } else {
            $scope.settingsFormSubmitted = true;
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

        return !($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0 || ($scope.activity.transformerStations && $scope.activity.transformerStations.length > 0));
    };

    $scope.checkForTransformerStationsRequired = function () {

        return !($scope.activity.useWholeArea || ($scope.activity.subGeographicalRegions && $scope.activity.subGeographicalRegions.length > 0));
    };

}]);
