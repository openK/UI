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
angular.module('myApp').controller('OverviewCtrl', ['$scope', '$log', '$timeout', '$http', '$filter', '$translate', '$state', 'uiGridConstants', 'i18nService', 'activityService', 'modalService', function ($scope, $log, $timeout, $http, $filter, $translate, $state, uiGridConstants, i18nService, activityService, modalService) {

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
        $scope.activity = activityService.activity();

        var KDate = function (c) {
            if (typeof c === 'undefined') {
                return new Date();
            } else {
                c = c.split('+');
                return new Date(c[0]);
            }
        }

        var detailsToBeDisplayed = ['dateCreated', 'createdBy', 'dateUpdated', 'updatedBy'];
        i18nService.setCurrentLang('de');

        $scope.isDeletable = function () {

            if ($scope.currentItem.processStatus !== "Beended") {
                return true;
            } else {
                return false;
            }
        }

        $scope.isValidDateFinish = function () {

            var dateStarted = new KDate($scope.currentItem.dateStarted);
            var dateFinished = new KDate($scope.currentItem.dateFinished);
            var now = new KDate();
            if (now.getTime() <= dateStarted.getTime() || now.getTime() <= dateFinished.getTime()) {

                return true;
            } else {
                return false;
            }


        }

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
                    modalService.close();
                }
            };
            modalService.open($scope, '/app/partials/confirm.html');
        }

        $scope.editFinishDate = function () {

            var fd = $filter('date')(new KDate($scope.currentItem.dateFinished), 'dd.MM.yyyy HH:mm');
            $scope.activity.dateFinished = fd;

            $scope.modalOptions = {
                "headline": $filter('translate')('PROCESS.EDIT.FINISHDATE'),
                "id": $scope.currentItem.id,
                "bodyText": $filter('translate')('PROCESS.EDIT.RECENTDATE'),
                "finishdate": $scope.currentItem.dateFinished,
                "actionButtonText": $filter('translate')('PROCESS.EDIT.CONFIRM'),
                "closeButtonText": $filter('translate')('PROCESS.EDIT.CANCEL'),
                "close": function () {
                    modalService.close();
                },
                "ok": function () {

                    modalService.close();
                }

            };

            var callback = function () {
                $('#editdatefinished').daterangepicker({
                    singleDatePicker: true,
                    timePicker24Hour: true,
                    timePicker: true,
                    timePickerIncrement: 15,
                    startDate: fd,
                    minDate: $.now(),
                    locale: {
                        format: 'DD.MM.YYYY HH:mm',
                        applyLabel: '&Uuml;bernehmen',
                        daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                        monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                        firstDay: 1
                    }
                });
            }

            modalService.open($scope, '/app/partials/editfinishdate.html', callback);






        }

        $scope.gotoPageNumber = function () {
            if ($scope.data.currentpage >= $scope.data.totalPages) {
                $scope.data.currentpage = $scope.data.totalPages;
            }
            $scope.currentpage = $scope.data.currentpage - 1;
            callPageObject();
        }

        var callPageObject = function () {
            $response = activityService.loadParentActivities(
                    $scope.currentpage,
                    $scope.searchOptions.pageSize,
                    (new KDate()).getTime(),
                    $scope.searchOptions.sort ? $scope.searchOptions.sortColumn + "," + $scope.searchOptions.sort : '',
                    $scope.searchOptions.filter.filter ? $scope.searchOptions.filter.filter : ''
                    );
            $response.success(function (data) {
                $scope.overview.data = data.content;
                $scope.data.totalPages = $scope.parentActivities.totalPages;
                $scope.data.currentpage = $scope.currentpage + 1;
                $scope.navigateToDetails(data.content[0].id);
            })
        }

        $scope.getFirstPage = function () {
            $scope.currentpage = 0;
            callPageObject();
        }

        $scope.getLastPage = function () {
            $scope.currentpage = $scope.data.totalPages - 1;
            callPageObject();
        }

        $scope.getNextPage = function () {
            $scope.currentpage++;
            if ($scope.currentpage < $scope.data.totalPages) {
                callPageObject();
            } else {
                $scope.currentpage = $scope.data.totalPages - 1;
            }
        }

        $scope.getPreviousPage = function () {
            $scope.currentpage--;
            if ($scope.currentpage >= 0) {
                callPageObject();
            } else {
                $scope.currentpage = 0;
            }
        }

        $scope.navigateToDetails = function (activityId) {
            activityService.currentParentActivityId(activityId);
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
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]]};
                                $scope.data.isDate = true;
                                break;
                            case 'activePowerJpaToBeReduced':
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]].value + 'MW'};
                                break;
                            default:
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]]};
                        }
                        $scope.data.details[detailsToBeDisplayed[j]] = value;


                    }
                    $scope.currentItem = $scope.overview.data[i];
                    $scope.childActivities.data = $scope.overview.data[i].actionOverviewDtoList;

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
                filter: []
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
                    name: 'activePowerJpaToBeReduced.value',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.activePowerJpaToBeReduced.value | number : 2}} MW</div>',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    width: '15%'
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
                        activityService.activity($scope.childActivities.data[$scope.childActivities.data.length - 1]);
                        $scope.childGridApi.selection.selectRow($scope.childActivities.data[$scope.childActivities.data.length - 1]);
                        $scope.childGridApi.cellNav.scrollToFocus($scope.childActivities.data[$scope.overview.data.length - 1], $scope.childActivities.columnDefs[0]);
                    });

                });

                $scope.gridApi.core.on.filterChanged($scope, function () {

                    var grid = this.grid;

                    if (angular.isDefined($scope.filterTimeout)) {
                        $timeout.cancel($scope.filterTimeout);
                    }
                    $scope.filterTimeout = $timeout(function () {

                        var filter = {
                            filter: {}
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
                    field: 'id',
                    width: '10%',
                    displayName: 'ID'
                },
                {
                    field: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.STARTDATE',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '20%',
                },
                {
                    field: 'dateFinished',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ENDDATE',
                    width: '20%',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                },
                {
                    field: 'activePowerJpaToBeReduced.value',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    width: '20%',
                    cellClass: 'col-numbers',
                    filter: uiGridConstants.filter.GREATER_THAN_OR_EQUAL
                },
                {
                    field: 'description',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.DESCRIPTION'

                },
            ],
            onRegisterApi: function (gridApi) {
                $scope.childGridApi = gridApi;
                $scope.childGridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    $scope.childGridApi.selection.selectRow(newRowCol.row.entity);
                });
            }
        };


        $scope.parentActivities = activityService.getParentActivities();
        $scope.overview.data = $scope.parentActivities.content;
        $scope.data.totalPages = $scope.parentActivities.totalPages;


        $timeout(function () {
            if ($scope.gridApi.selection.selectRow) {
                $scope.gridApi.selection.selectRow($scope.overview.data[0]);
            }
            if ($scope.childGridApi.selection.selectRow) {
                $scope.childGridApi.selection.selectRow($scope.childActivities.data[$scope.childActivities.data.length - 1]);
            }

            if ($scope.firstcall) {
                $scope.gridApi.cellNav.scrollToFocus($scope.overview.data[0], $scope.overview.columnDefs[0]);
                $scope.childGridApi.cellNav.scrollToFocus($scope.childActivities.data[$scope.overview.data.length - 1], $scope.childActivities.columnDefs[0]);
                $scope.firstcall = false;
            }

        });
        $scope.navigateToDetails($scope.overview.data[0].id);






    }]);
