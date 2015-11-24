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
angular.module('myApp').controller('OverviewCtrl', ['$scope', '$log', '$timeout', '$http', '$filter', '$translate', '$state', 'uiGridConstants', 'i18nService', function ($scope, $log, $timeout, $http, $filter, $translate, $state, uiGridConstants, i18nService) {

        $scope.data = {};
        $scope.data.count = 0;
        $scope.data.details = {};
        $scope.firstcall = true;
        $scope.data.currentNumber = 1;
        var detailsToBeDisplayed = ['id', 'dateCreated', 'dateStarted', 'dateFinished', 'geographicalRegion', 'reasonOfReduction', 'activePowerJpaToBeReduced'];
        i18nService.setCurrentLang('de');

        var makeFlat = function (obj) {

            var arr = [];
            for (key in obj) {
                arr.push(obj[key]);
            }
            return arr.join('');
        }
        var activePowerFilter = function (searchTerm, cellValue, row, column) {

            if (parseInt(searchTerm) <= parseInt(cellValue)) {
                return true;
            } else {
                return false;
            }
        };


        $scope.navigateToDetails = function (activityId) {
            //window.location.search += '?page=details&activityId=' + entity.id;
            //$state.go('state1details', { activityId: activityId }); 

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
                                value = {key: detailsToBeDisplayed[j], value: new Date($scope.overview.data[i][detailsToBeDisplayed[j]])};
                                $scope.data.isDate = true;
                                break;
                            case 'activePowerJpaToBeReduced':
                                value = {key: detailsToBeDisplayed[j], value: makeFlat($scope.overview.data[i][detailsToBeDisplayed[j]])};
                                break;
                            default:
                                value = {key: detailsToBeDisplayed[j], value: $scope.overview.data[i][detailsToBeDisplayed[j]]};
                        }
                        $scope.data.details[detailsToBeDisplayed[j]] = value;


                    }
                    $scope.childActivities.data = $scope.overview.data[i].childrenActivityJpaList;
                    console.log($scope.childActivities.data);

                }
            }





        };
        $scope.navigateToCreate = function (id) {
            $state.go('Regulation.CreateDownRegulation');
            /*
             $state.go('state1details', { activityId: activityId });
             if (isFinite($scope.activityId)) {
             window.location.search += '?page=create&parentID=' +    $scope.activityId;
             } else {
             window.location.search += '?page=create';
             */
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
            pageSize: 25,
            sort: null,
            sortColumn: '',
            filter: {
                filter: []
            }
        };
        $scope.overview = {
            enableRowHeaderSelection: false,
            enableRowSelection: true,
            multiSelect: false,
            keepLastSelected: false,
            minRowsToShow: 10,
            enableSorting: true,
            enableFiltering: true,
            enableScrollbars: false,
            enablePagination: false,
            enablePaginationControls: false,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
            paginationPageSizes: [5, 10, 25, 50],
            paginationPageSize: 10,
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
                    width: '50%'
                },
                //{
                //    name: 'substationList', headerCellFilter: 'translate', displayName: 'GRID.SUBSTATIONLIST',
                //    cellTemplate: $scope.feederStationTemplate
                //},
                {
                    name: 'practice',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.PRACTISE',
                    enableFiltering: false,
                    cellFilter: 'booleanFilter'

                }

                /*          
                 {
                 name: 'action', 
                 headerCellFilter: 'translate', 
                 displayName: '', 
                 enableColumnMenu: false,
                 enableFiltering: false,
                 cellTemplate: $scope.linkToDetailsTemplate
                 }
                 */

            ],
            onRegisterApi: function (gridApi) {

                $scope.gridApi = gridApi;

                gridApi.cellNav.on.navigate($scope, function (newRowCol, oldRowCol) {
                    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
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

                        $scope.getDataAsync();
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

                    $scope.getDataAsync();
                });

                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {

                    console.log(row.entity.id);
                    $scope.navigateToDetails(row.entity.id);

                });

                $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                    $scope.searchOptions.pageNumber = newPage;
                    $scope.searchOptions.pageSize = pageSize;

                    $scope.getDataAsync();
                });
            }
        };
        $scope.childActivities = {
            minRowsToShow: 5,
            enableSorting: true,
            enableFiltering: true,
            enableScrollbars: false,
            enablePagination: true,
            enablePaginationControls: true,
            enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
            enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
            paginationPageSizes: [5],
            paginationPageSize: 5,
            columnDefs: [
                {field: 'id', width: '5%'},
                {
                    field: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.STARTDATE',
                    cellFilter: 'date:this',
                    width: '10%',
                },
                {
                    field: 'dateFinished',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ENDDATE',
                    width: '10%',
                    cellFilter: 'date:this',
                },
                {
                    field: 'activePowerJpaToBeReduced.value',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    width: '15%',
                    cellClass: 'col-numbers',
                    filter: {
                        condition: activePowerFilter

                                // uiGridConstants.filter.GREATER_THAN_OR_EQUAL
                    }
                },
                {
                    field: 'description',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.DESCRIPTION'

                },
            ]

        };


        $timeout(function () {
            $scope.gridApi.core.handleWindowResize();
        }, 500);

        // get data from server
        $scope.getDataAsync = function () {
            var params = {
                'page': ($scope.searchOptions.pageNumber - 1),
                'size': $scope.searchOptions.pageSize,
                't': new Date().getTime()
            };

            if ($scope.searchOptions.sortColumn) {
                params.sort = ($scope.searchOptions.sortColumn + "," + $scope.searchOptions.sort);
            }

            if ($scope.searchOptions.filter && $scope.searchOptions.filter.filter) {
                params.filter = $scope.searchOptions.filter.filter;
            }
            /*
             $http.get('app/findparentactivitylist.json').then(function(result){
             $scope.overview.data = result.data.content;
             }, function(error){
             alert(JSON.stringify(error));
             });
             
             */
            $http.get("http://192.168.1.2:8080/openk-eisman-portlet/rest/findparentactivitylist", {
                "timeout": 30000,
                "params": params

            }).success(function (data) {

                $log.info("Success loading /openk-eisman-portlet/rest/findparentactivitylist");
                //$scope.overview.data = $filter('orderBy')(data.content, "id", true);
                $scope.overview.data = data.content;

                $timeout(function () {
                    if ($scope.gridApi.selection.selectRow) {
                        $scope.gridApi.selection.selectRow($scope.overview.data[0]);
                    }
                    if ($scope.firstcall) {
                        $scope.gridApi.cellNav.scrollToFocus($scope.overview.data[0], $scope.overview.columnDefs[0]);
                        $scope.firstcall = false;
                    }


                });



                $scope.navigateToDetails(data.content[0].id);

            }).error(function (data, status, headers, config) {

                $log.error('Cannot load /openk-eisman-portlet/rest/findparentactivitylist/');
            });
        };

        $scope.getDataAsync();

    }]);
