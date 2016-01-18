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
angular.module('myApp').controller('OverviewCtrl', ['$scope', '$rootScope', '$log', '$timeout', '$http', '$filter', '$translate', '$state', '$stateParams', 'uiGridConstants', 'i18nService', 'activityService', 'modalService', 'dateService', '$uibModal', 'modalServiceNew', function ($scope, $rootScope, $log, $timeout, $http, $filter, $translate, $state, $stateParams, uiGridConstants, i18nService, activityService, modalService, dateService, $uibModal, modalServiceNew) {
        $scope.data = {};
        $scope.data.count = 0;
        $scope.data.details = {};
        $scope.firstcall = true;
        $scope.data.currentNumber = 1;
        $scope.currentItem = {};
        $scope.currentpage = 0;
        $scope.data.currentpage = 0;
        $scope.parentActivities = {};
        $scope.data.currentpage = 1;

        var detailsToBeDisplayed = ['dateCreated', 'createdBy', 'dateUpdated', 'updatedBy', 'description'];
        i18nService.setCurrentLang('de');

        $scope.isDeletable = function () {
            if ($scope.currentItem.id && $scope.currentItem.processStatus === "Pending" || $scope.currentItem.processStatus === "WithoutSchedule") {
                return true;
            } else {
                return false;
            }
        };

        $scope.isEditable = function () {
            if ($scope.currentItem.id && ($scope.currentItem.processStatus === "WithoutSchedule" || $scope.currentItem.processStatus === "Pending")) {
                return true;
            } else {
                return false;
            }
        };

        $scope.canEditFinishDate = function () {
            var dateStarted = new Date($scope.currentItem.dateStarted);
            var dateFinished = new Date($scope.currentItem.dateFinished);
            var now = $.now();
            $log.info($scope.currentItem.dateFinished);
            if ($scope.currentItem.id && $scope.currentItem.processStatus === "Pending" || ($scope.currentItem.processStatus === "Live" && (now >= dateStarted.getTime() && now <= dateFinished.getTime()))) {
                return true;
            } else {
                ;
                return false;
            }
        };

        $scope.canAddActivity = function () {
            var dateStarted = new Date($scope.currentItem.dateStarted);
            var dateFinished = new Date($scope.currentItem.dateFinished);
            var now = $.now();
            if ($scope.currentItem.id && ($scope.currentItem.processStatus === "Live" && (now >= dateStarted.getTime() && now <= dateFinished.getTime()))) { // || $scope.currentItem.processStatus === "Pending" ???
                return true;
            } else {
                return false;
            }
        };

        $scope.isActivityActive = function () {
            var dateStarted = new Date($scope.currentItem.dateStarted);
            var dateFinished = new Date($scope.currentItem.dateFinished);
            var now = $.now();
            if ($scope.currentItem.id && ($scope.currentItem.processStatus === "Live" && now >= dateStarted.getTime() && now <= dateFinished.getTime())) {
                return true;
            } else {
                return false;
            }
        };

        $scope.deleteProcess = function () {
            $scope.modalOptions = {
                "headline": $filter('translate')('DELETE.PROCESS'),
                "id": $scope.currentItem.id,
                "bodyText": $filter('translate')('DELETE.PROCESS.QUESTION'),
                "actionButtonText": $filter('translate')('DELETE.PROCESS.CONFIRM'),
                "closeButtonText": $filter('translate')('DELETE.PROCESS.DENY'),
                "close": function () {
                    modalService.close();
                },
                "ok": function () {
                    $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/deleteprocess", $scope.currentItem.id).then(function (result) {
                        $state.forceReload();
                    }, function (error) {
                        modalServiceNew.showErrorDialog(error).then(function () {
                            $state.forceReload();
                        });
                    });
                    modalService.close();
                }
            };
            modalService.open($scope, templPath + 'partials/confirm.html');
        };

        $scope.stopProcess = function () {
            $scope.modalOptions = {
                "headline": $filter('translate')('PROCESS.STOP'),
                "id": $scope.currentItem.id,
                "bodyText": $filter('translate')('PROCESS.STOP.CONFIRM'),
                "actionButtonText": $filter('translate')('PROCESS.STOP'),
                "closeButtonText": $filter('translate')('PROCESS.EDIT.CANCEL'),
                "close": function () {
                    modalService.close();
                },
                "ok": function () {
                    var originalProcessFinishDate = new Date($scope.currentItem.dateFinished);
                    var distance = originalProcessFinishDate.getTime() - $.now();
                    if (distance > 0) {
                        var endDate = '"' + $filter('date')(new Date($.now() + 10000), 'yyyy-MM-ddTHH:mm:ss.sssZ') + '"';
                        return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/modifydatefinished/" + $scope.currentItem.id, endDate).then(function (result) {
                            $state.forceReload();
                        }, function (error) {
                            modalServiceNew.showErrorDialog(error).then(function () {
                                $state.forceReload();
                            });
                        });
                    }
                }
            };
            modalService.open($scope, templPath + 'partials/confirm.html');
        };

        $scope.hasReductions = function () {

            if (typeof $scope.currentItem.processStatus === 'undefined') {
                return false;
            } else {
                if ($scope.currentItem.processStatus === 'WithoutSchedule' || $scope.currentItem.processStatus === 'WithoutScheduleDeleted') {
                    return false;
                } else {
                    return true;
                }
            }
        };

        $scope.showEngines = function () {

            $scope.modalOptions = {
                "headline": "Vorgangs-ID",
                "id": $scope.currentItem.id,
                "startDate": $scope.currentItem.dateStarted,
                "endDate": $scope.currentItem.dateFinished,
                "closeButtonText": $filter('translate')('CLOSE'),
                "close": function () {
                    modalService.close();
                }

            };
            modalService.open($scope, templPath + 'partials/enginelist.html', false, 'SynchronousMachineListByProcessIdCtrl', '90p');
        };

        $scope.editFinishDate = function () {

            var fd = $filter('date')(new Date($scope.currentItem.dateFinished), 'dd.MM.yyyy HH:mm');
            $scope.activity.dateFinished = fd;

            $scope.modalOptions = {
                "headline": $filter('translate')('PROCESS.EDIT.FINISHDATE') + ': ',
                "id": $scope.currentItem.id,
                "bodyText": $filter('translate')('PROCESS.EDIT.RECENTDATE'),
                "finishdate": $scope.currentItem.dateFinished,
                "startdate": $scope.currentItem.dateStarted,
                "actionButtonText": $filter('translate')('PROCESS.EDIT.CONFIRM'),
                "closeButtonText": $filter('translate')('PROCESS.EDIT.CANCEL'),
                "close": function () {
                    modalService.close();
                    $state.forceReload();
                },
                "ok": function () {
                    modalService.close();
                    $timeout(function () {
                        var endDate = '"' + dateService.formatDateForBackend($scope.activity.dateFinished) + '"';
                        $scope.modalOptions = {
                            "headline": $filter('translate')('PROCESS.EDIT.CONFIRM') + ': ' + $scope.activity.dateFinished,
                            "bodyText": $filter('translate')('PROCESS.FINISHDATE.CONFIRM'),
                            "actionButtonText": $filter('translate')('PROCESS.EDIT.CONFIRM'),
                            "closeButtonText": $filter('translate')('PROCESS.EDIT.CANCEL'),
                            "close": function () {
                                modalService.close();
                                $state.forceReload();
                            },
                            "ok": function () {
                                return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/modifydatefinished/" + $scope.currentItem.id, endDate).then(function (result) {
                                    $state.forceReload();
                                }, function (error) {
                                    modalServiceNew.showErrorDialog(error).then(function () {
                                        $state.forceReload();
                                    });
                                });
                            }
                        };
                        modalService.open($scope, templPath + 'partials/confirm.html');
                    }, 100);
                }

            };
            var callback = function () {
                var minFinishDate = new Date($scope.currentItem.dateStarted);
                var now = new Date($.now());
                if (minFinishDate > now) {
                    minFinishDate = new Date(minFinishDate.setMinutes(minFinishDate.getMinutes() + 1));
                } else {
                    minFinishDate = new Date(now.setMinutes(now.getMinutes() + 1));
                }
                $('#editdatefinished').daterangepicker({
                    singleDatePicker: true,
                    timePicker24Hour: true,
                    timePicker: true,
                    timePickerIncrement: 1,
                    startDate: fd,
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
            };
            modalService.open($scope, templPath + 'partials/editfinishdate.html', callback);
        };

        var callPageObject = function () {
            var tab;
            if (location.toString().indexOf('Terminated') > -1) {
                tab = 'Terminated';
            } else
            if (location.toString().indexOf('Deleted') > -1) {
                tab = 'Deleted';
            }
            activityService.loadParentActivities(
                    $scope.currentpage,
                    $scope.searchOptions.pageSize,
                    (new Date()).getTime(),
                    $scope.searchOptions.sort ? $scope.searchOptions.sortColumn + "," + $scope.searchOptions.sort : '',
                    $scope.searchOptions.filter.filter ? $scope.searchOptions.filter.filter : '',
                    tab
                    ).then(function (data) {
                $scope.overview.data = data.content;
                $scope.data.totalPages = data.totalPages;
                $scope.data.currentpage = $scope.currentpage + 1;
                $scope.navigateToDetails(data.content[0].id);
            });
        };

        $scope.gotoPageNumber = function () {
            if ($scope.data.currentpage >= $scope.data.totalPages) {
                $scope.data.currentpage = $scope.data.totalPages;
            }
            $scope.currentpage = $scope.data.currentpage - 1;
            callPageObject();
        };


        $scope.getFirstPage = function () {
            $scope.currentpage = 0;
            callPageObject();
        };

        $scope.getLastPage = function () {
            $scope.currentpage = $scope.data.totalPages - 1;
            callPageObject();
        };

        $scope.getNextPage = function () {
            $scope.currentpage++;
            if ($scope.currentpage < $scope.data.totalPages) {
                callPageObject();
            } else {
                $scope.currentpage = $scope.data.totalPages - 1;
            }
        };

        $scope.getPreviousPage = function () {
            $scope.currentpage--;
            if ($scope.currentpage >= 0) {
                callPageObject();
            } else {
                $scope.currentpage = 0;
            }
        };

        $scope.navigateToDetails = function (activityId) {
            activityService.currentParentActivityId(activityId);
            $scope.activity = activityService.currentParentActivity();
            $scope.data.count = $scope.overview.data.length;
            for (var i = 0; i < $scope.data.count; i++) {

                if ($scope.overview.data[i].id === activityId) {

                    $scope.data.id = activityId;
                    $scope.data.currentNumber = i + 1;
                    for (var j = 0; j < detailsToBeDisplayed.length; j++) {

                        $scope.data.isDate = true;
                        var value;
                        switch (detailsToBeDisplayed[j]) {

                            case 'dateCreated':
                            case 'dateStarted':
                            case 'dateFinished':
                            case 'dateUpdated':
                                value = {key: detailsToBeDisplayed[j], value: $filter('date')($scope.overview.data[i][detailsToBeDisplayed[j]], "dd.MM.yyyy HH:mm")};
                                $scope.data.isDate = true;
                                break;
                            case 'activePowerJpaToBeReduced':
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]].value + 'MW'};
                                break;
                            default:
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]]};
                        }
                        $scope.data.details[detailsToBeDisplayed[j]] = value;
                        $scope.data.injectionList = $scope.overview.data[i].pointOfInjectionList;
                        $scope.data.injectionType = $scope.overview.data[i].pointOfInjectionType;


                    }
                    $scope.currentItem = $scope.overview.data[i];
                    $scope.childActivities.data = $scope.overview.data[i].childActivityList;

                }
            }
        };

        $scope.navigateToCreate = function (id) {
            $state.go('Regulation.CreateDownRegulation');
        };

        $scope.linkToDetailsTemplate =
                '<div class="btn-group" role="group" aria-label="details">' +
                '<button type="button" class="btn-sm btn-default" ng-click="grid.appScope.navigateToDetails(row.entity.id)">' +
                '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
                '</button>' +
                '<button type="button" class="btn-sm btn-default" disabled="disabled">' +
                '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
                '</button>' +
                '</div>';

        $scope.searchOptions = {
            pageNumber: 1,
            pageSize: activityService.pageSize,
            sort: null,
            sortColumn: '',
            filter: {
                filter: {
                    'isDeleted': 'true',
                    'isTerminated': 'false'

                }
            }
        };
        $scope.overview = {
            useExternalSorting: true,
            useExternalFiltering: true,
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            multiSelect: false,
            keepLastSelected: false,
            minRowsToShow: $scope.searchOptions.pageSize,
            enableSorting: true,
            enableFiltering: true,
            enableScrollbars: false,
            enablePagination: false,
            enablePaginationControls: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {
                    name: 'id',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ID',
                    width: '4%'
                },
                {
                    name: 'dateCreated',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.CREATED',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '8%'
                },
                {
                    name: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.STARTDATE',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '8%'
                },
                {
                    name: 'dateFinished',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ENDDATE',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '8%'
                },
                {
                    name: 'reductionValue',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.reductionValue | number : 2}} MW</div>',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    width: '11%'
                },
                {
                    name: 'reasonOfReduction',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.REASONOFREDUCTION',
                    width: '30%'
                },
                {
                    name: 'processStatus',
                    headerCellFilter: 'translate',
                    cellFilter: 'translate',
                    displayName: 'STATE.STATE'

                },
                {
                    name: 'practice',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.PRACTISE',
                    enableFiltering: false,
                    cellFilter: 'booleanFilter'

                }
            ],
            onRegisterApi: function (gridApi) {

                $scope.gridApi = gridApi;

                gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
                });

                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $scope.navigateToDetails(row.entity.id);
                    $timeout(function () {
                        activityService.childActivity($scope.childActivities.data[$scope.childActivities.data.length - 1]);
                        $scope.childGridApi.selection.selectRow($scope.childActivities.data[$scope.childActivities.data.length - 1]);
                        $scope.childGridApi.cellNav.scrollToFocus($scope.childActivities.data[$scope.overview.data.length - 1], $scope.childActivities.columnDefs[0]);
                    });

                });

                $scope.gridApi.core.on.filterChanged($scope, function () {

                    var grid = this.grid;
                    $scope.currentpage = 0;

                    if (angular.isDefined($scope.filterTimeout)) {
                        $timeout.cancel($scope.filterTimeout);
                    }
                    $scope.filterTimeout = $timeout(function () {

                        var filter = {
                            filter: {
                                'isDeleted': 'true',
                                'isTerminated': 'false'

                            }
                        };

                        grid.columns.forEach(function (column) {

                            if (column.filters && column.filters.length > 0 && column.filters[0].term) {

                                filter.filter[column.field] = column.filters[0].term;
                            }
                        });

                        $scope.searchOptions.filter = filter;
                        callPageObject();
                    }, 250);
                });

                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                    if (sortColumns.length === 0) {

                        $scope.searchOptions.sort = undefined;
                        $scope.searchOptions.sortColumn = undefined;

                    } else {

                        $scope.searchOptions.sort = sortColumns[0].sort.direction;
                        $scope.searchOptions.sortColumn = sortColumns[0].colDef.name;
                    }
                    callPageObject();
                });

            }
        };
        $scope.childActivities = {
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            multiSelect: false,
            keepLastSelected: false,
            minRowsToShow: 9,
            enableSorting: true,
            enableFiltering: true,
            enableScrollbars: false,
            enablePaginationControls: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            columnDefs: [
                {
                    field: 'seqNum',
                    headerCellFilter: 'translate',
                    width: '8%',
                    displayName: 'GRID.SEQNUM'
                },
                {
                    field: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.STARTDATE',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '16%'
                },
                {
                    field: 'dateFinished',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ENDDATE',
                    width: '16%',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'"
                },
                {
                    field: 'reductionValue',
                    headerCellFilter: 'translate',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.reductionValue | number : 2}} MW</div>',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    width: '28%',
                    cellClass: 'col-numbers',
                    filter: uiGridConstants.filter.GREATER_THAN_OR_EQUAL
                },
                {
                    field: 'description',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.DESCRIPTION'
                }
            ],
            onRegisterApi: function (gridApi) {
                $scope.childGridApi = gridApi;
                $scope.childGridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    var activity = newRowCol.row.entity;
                    $scope.childGridApi.selection.selectRow(activity);
                });
            }
        };

        $scope.parentActivities = activityService.getParentActivities();
        $scope.overview.data = $scope.parentActivities.content;
        $scope.data.totalPages = $scope.parentActivities.totalPages;
        $log.log($scope.parentActivities.totalPages);
        $log.debug($scope.parentActivities);

        $timeout(function () {
            if ($scope.gridApi.selection.selectRow) {
                $scope.gridApi.selection.selectRow($scope.overview.data[0]);
            }
            if ($scope.childGridApi.selection.selectRow) {
                var activity = $scope.childActivities.data[$scope.childActivities.data.length - 1];
                $scope.childGridApi.selection.selectRow(activity);
            }

            if ($scope.firstcall) {
                $scope.gridApi.cellNav.scrollToFocus($scope.overview.data[0], $scope.overview.columnDefs[0]);
                $scope.childGridApi.cellNav.scrollToFocus($scope.childActivities.data[$scope.overview.data.length - 1], $scope.childActivities.columnDefs[0]);
                $scope.firstcall = false;
            }

        });
        if ($scope.overview.data.length > 0) {
            $scope.navigateToDetails($scope.overview.data[0].id);
        }

    }]);
