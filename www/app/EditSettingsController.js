app.controller('EditSettingsController', ['$scope', '$state', '$stateParams', '$rootScope', '$http', '$modal', '$log', 'activityService', '$translate', '$filter', 'dateService', function ($scope, $state, $stateParams, $rootScope, $http, $modal, $log, activityService, $translate, $filter, dateService) {

        $scope.$parent.mytimer = false;
        $scope.$parent.$broadcast('timer-reset');
        $scope.activityConfigData = activityService.activityConfigData().activity;
        $scope.activity = activityService.activity();
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

        $scope.parentActivityId = activityService.currentParentActivityId();

        var now = new Date($.now());
        var newDateStart = new Date(now.setMinutes(parseInt((now.getMinutes() + 25) / 15) * 15))
        var newDateFinished = new Date(new Date(newDateStart.getTime()).setMinutes(newDateStart.getMinutes() + 30, 0, 0));
        var newStartDate = new Date($scope.activity.dateStarted);
        now = new Date($.now());
        if (newStartDate < now) {
            newStartDate = newDateStart;
        }
        var newFinishedDate = new Date($scope.activity.dateFinished);
        if (newFinishedDate < newStartDate) {
            newFinishedDate = newDateFinished;
        }

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

                    $state.go('state1', {show: 'Aktiv'});

                }).error(function (data, status, headers, config) {
                    $log.error('openk-eisman-portlet/rest/activity/');
                });

            } else {

                $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

                    $state.go('state1', {show: 'Aktiv'});

                }).error(function (data, status, headers, config) {
                    $log.error('openk-eisman-portlet/rest/activity/');
                });
            }
        };

        $scope.getPostData = function () {

            $scope.activity.dateStarted = dateService.formatDateForBackend($scope.dateStarted);
            $scope.activity.dateFinished = dateService.formatDateForBackend($scope.dateFinished);
            var data = {
                "id": $scope.activity.id,
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
