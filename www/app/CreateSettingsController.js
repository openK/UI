app.controller('CreateSettingsController', ['$scope', '$state', '$stateParams', '$modal', 'activityService', '$filter', 'dateService', 'modalServiceNew', '$translate', function ($scope, $state, $stateParams, $modal, activityService, $filter, dateService, modalServiceNew, $translate) {

    $scope.activity = activityService.childActivity();
    activityService.mode($stateParams.mode || activityService.mode());
    $scope.$parent.mytimer = false;
    $scope.activityConfigData = activityService.activityConfigData();
    $scope.activity.reductionPositive = true;

    if (activityService.mode === 'edit' || activityService.mode === 'add') {
        $scope.activity.parentActivityJpaId = activityService.currentParentActivityId();
    }

    if (activityService.mode === 'add') {
        $scope.activity.id = null;
    }

    if ($scope.activity.pointOfInjectionType === 'GEOGRAPHICALREGION') {
        $scope.activity.useWholeArea = true;
    }

    if ($scope.activity.pointOfInjectionType && $scope.activity.pointOfInjectionType.length > 0) {
        $scope.activity.pointOfInjectionTypeString = $translate.instant($scope.activity.pointOfInjectionType);
    }


    if ($scope.activity.pointOfInjectionType === 'SUBSTATION' && $scope.activity.pointOfInjectionList) {
        if (!$scope.activity.transformerStations) {
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
    }

    if ($scope.activity.pointOfInjectionType === 'SUBGEOGRAPHICALREGION' && $scope.activity.pointOfInjectionList) {
        if (!$scope.activity.transformerStations) {
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

    $scope.dateStarted = $filter('date')(dateStarted, 'dd.MM.yyyy HH:mm');
    $scope.dateFinished = $filter('date')(dateFinished, 'dd.MM.yyyy HH:mm');

    $scope.$watch('dateStarted', function (newValue, oldValue) {
        $scope.activity.dateStarted = dateService.formatDateForBackend(newValue);
    });

    $scope.$watch('dateFinished', function (newValue, oldValue) {
        $scope.activity.dateFinished = dateService.formatDateForBackend(newValue);
    });

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

    $scope.saveWithoutRegulation = function () {

        if ($scope.settingsForm.$invalid) {
            return;
        }

        activityService.saveWithoutRegulation($scope.activity).then(function () {
            $state.go('state1', {
                show: 'Aktiv'
            });
        }, function () {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', {
                    show: 'Aktiv'
                });
            });
        });
    };

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'Regulation.CreateProposal.Main' && $scope.settingsForm.$invalid) {
            event.preventDefault();
        }
        $scope.settingsForm.$setSubmitted();
    });

    $scope.isValidTimeInterval = function (dateStarted, dateFinished) {
        return dateService.isDateBehind(dateStarted, dateFinished);
    };

    $scope.isNoAreaDefined = function () {

        return !$scope.activity.useWholeArea &&
                $scope.activity.transformerStations.length === 0 &&
                $scope.activity.subGeographicalRegions.length === 0;
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
