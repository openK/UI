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
angular.module('myApp').controller('OverviewCtrl', ['$scope', '$log', '$timeout', '$http', '$filter', '$translate', '$state', function ($scope, $log, $timeout, $http, $filter, $translate, $state) {
    $scope.navigateToDetails = function (activityId) {
        //window.location.search += '?page=details&activityId=' + entity.id;
        $state.go('state1details', { activityId: activityId });
    };
    $scope.navigateToCreate = function (id) {
        $state.go('state2');
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
        enableFiltering: true,
        showGridFooter: false,
        showColumnFooter: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25,
        enablePaginationControls: true,
        enableColumnMenus: false,
        useExternalPagination: true,
        useExternalSorting: true,
        useExternalFiltering: true,
        rowHeight: 33,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 2, // 0: never, 1: always, 2: when needed
        //sortInfo: {fields:['id'], directions:['desc']},
        columnDefs: [
            {
                name:'id',
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
                width: '40%'
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
                cellFilter: 'booleanFilter',
                width: '10%'
            },
            {
                name: 'action', headerCellFilter: 'translate', displayName: '', enableColumnMenu: false,
                enableFiltering: false,
                cellTemplate: $scope.linkToDetailsTemplate
            }
        ],
        onRegisterApi: function (gridApi) {

            $scope.gridApi = gridApi;

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

            $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {

                $scope.searchOptions.pageNumber = newPage;
                $scope.searchOptions.pageSize = pageSize;

                $scope.getDataAsync();
            });
        }
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

        $http.get('app/findparentactivitylist.json').then(function(result){
            $scope.overview.data = result.data.content;
        }, function(error){
            alert(JSON.stringify(error));
        });
        //$http.get("/openk-eisman-portlet/rest/findparentactivitylist", {
        //
        //    "timeout": 30000,
        //    "params": params
        //
        //}).success(function (data) {
        //
        //    $log.info("Success loading /openk-eisman-portlet/rest/findparentactivitylist");
        //    //$scope.overview.data = $filter('orderBy')(data.content, "id", true);
        //    $scope.overview.data = data.content;
        //
        //}).error(function (data, status, headers, config) {
        //
        //    $log.error('Can not load /openk-eisman-portlet/rest/findparentactivitylist/');
        //});
    };

    $scope.getDataAsync();

}]);
