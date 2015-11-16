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

app.controller('DetailController', ['$scope', '$state', '$log', '$timeout', '$http', '$location', '$sce', '$filter', '$translate',
    function ($scope, $state, $log, $timeout, $http, $location, $sce, $filter, $translate) {

        $scope.getParam = function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        $scope.navigateToCreate = function (id) {
            window.location.search = '?page=create&parentActivityId=' + $scope.activityId;
        };

        $scope.navigateToCreateWithProposal = function (entry) {
            window.location.search = '?page=create&editActivityId=' + entry.id + "&parentActivityId=" + $scope.activityId;
        };

        $scope.endActivity = function (activityId) {

            $http.put("/openk-eisman-portlet/rest/finishactivity/", {
                "timeout": 30000,
//            "params": {
                "parentActivityJpaId": $scope.activityId
//            }
            }).success(function (data) {
                window.location.search = '?page=details&activityId=' + $scope.activityId;
            }).
                error(function (data, status, headers, config) {
                    //TODO Fehlerhandling
                });
        };

        $scope.activityId = $scope.getParam('activityId');

        $scope.detailHTML = '';

        $scope.editTemplate = '<a class="btn btn-primary btn-sm" style="margin:1px; {{row.entity}}" ng-click="grid.appScope.navigateToCreateWithProposal(row.entity)" >{{ "CHANGE" | translate }}</a>';
        $scope.feederStationTemplate = '<div><span custom-popover popover-placement="bottom" popover-label="{{row.entity.substationList}}"></span></div>';

        $scope.detailTemplate = '<div class="col-xs-12 col-sm-6 col-lg-3"><div class="panel panel-default"><div class="panel-heading">' +
            '<h3 class="panel-title">{head}</h3></div><div class="panel-body">{content}</div></div></div>';

        $scope.searchOptions = {
            pageNumber: 1,
            pageSize: 25,
            sort: null,
            sortColumn: '',
            filter: {
                filter: []
            }
        };

        $scope.detail = {
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableColumnMenus: false,
            noUnselect: true,
            showGridFooter: false,
            showColumnFooter: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
            enablePagingControls: true,
            useExternalPagination: true,
            useExternalSorting: true,
            rowHeight: 33,
            useExternalFiltering: true,
            columnDefs: [
                {name: 'id', headerCellFilter: 'translate', displayName: 'GRID.ID', width: '10%'},
                {
                    name: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.STARTDATE',
                    cellFilter: "date:'short'"
                },
                {
                    name: 'dateFinished',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.ENDDATE',
                    cellFilter: "date:'short'"
                },
                {
                    name: 'activePowerJpaToBeReduced.value',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.POWERTOBEREDUCED',
                    cellTemplate: '<div style="padding:5px;" ng-bind="row.entity.activePowerJpaToBeReduced.value | number : 2"></div>'
                },
                {name: 'reasonOfReduction', headerCellFilter: 'translate', displayName: 'GRID.REASONOFREDUCTION'},
                {
                    name: 'substationList', headerCellFilter: 'translate', displayName: 'GRID.SUBSTATIONLIST',
                    cellTemplate: $scope.feederStationTemplate
                },
                {
                    name: 'practice',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.PRACTISE',
                    enableFiltering: false,
                    cellFilter: 'booleanFilter'
                },
                {
                    name: 'edit',
                    headerCellFilter: 'translate',
                    displayName: 'GRID.EDIT',
                    enableFiltering: false,
                    cellTemplate: $scope.editTemplate,
                    cellFilter: 'editFilter'
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

                $scope.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    $scope.displayDetails(row.entity);
                });
            }
        };

        $timeout(function () {
            $scope.gridApi.core.handleWindowResize();
        }, 500);


        $scope.displayDetails = function (dataEntity) {

            var tmp = '';
            var tmpContent = '';

            tmp += $scope.getDetailEntry('ID', dataEntity.id);

            //Abzuregelnde Leistung
            if (dataEntity.powerToBeReduced) {
                tmp += $scope.getDetailEntry('DETAILS.POWERTOBEREDUCED', dataEntity.powerToBeReduced.value + ' ' + dataEntity.powerToBeReduced.multiplier + dataEntity.powerToBeReduced.unit);
            }

            //Daten
            if (dataEntity.dateCreated) {
                tmp += $scope.getDetailEntry('DETAILS.CREATEDAT', new Date(dataEntity.dateCreated));
            }
            if (dataEntity.dateFinished && dataEntity.dateStarted) {
                var d = new Date(dataEntity.dateFinished - dataEntity.dateStarted);
                tmp += $scope.getDetailEntry('DETAILS.RUNTIME', new Date(dataEntity.dateStarted), new Date(dataEntity.dateFinished));
            }
            if (dataEntity.dateStarted) {
                tmp += $scope.getDetailEntry('DETAILS.STARTDATE', new Date(dataEntity.dateStarted));
            }
            if (dataEntity.dateFinished) {
                tmp += $scope.getDetailEntry('DETAILS.ENDDATE', new Date(dataEntity.dateFinished));
            }

            //Abregelgebiet
            if (dataEntity.geographicalRegion) {

                tmp += $scope.getDetailEntry('DETAILS.CHOOSENAREA', "Gesamtnetz");//"{{ 'DETAILS.RULEDAREA' | translate }}");

            } else if (dataEntity.subGeographicalRegionJpaList && dataEntity.subGeographicalRegionJpaList.length > 0) {

                tmpContent = '';
                dataEntity.subGeographicalRegionJpaList.forEach(function (column) {

                    tmpContent += column.name;
                    tmpContent += '</br>';

                });
                tmp += $scope.getDetailEntry('DETAILS.CHOOSENAREA', tmpContent);
            } else if (dataEntity.substationJpaList && dataEntity.substationJpaList.length > 0) {

                tmpContent = '';

                dataEntity.substationJpaList.forEach(function (column) {

                    tmpContent += column.name;
                    tmpContent += '</br>';

                });
                tmp += $scope.getDetailEntry('DETAILS.CHOOSENAREA', tmpContent);
            }

            //Begründung
            if (dataEntity.reasonOfReduction) {
                tmp += $scope.getDetailEntry('DETAILS.REASENOFREDUCTION', dataEntity.reasonOfReduction);
            }

            //Übung
            if (dataEntity.practise) {

                tmp += $scope.getDetailEntry('DETAILS.PRACTISE', dataEntity.practise ? "{{ 'YES' | translate }}" : "{{ 'NO' | translate }}");
            }

            //Abzuregelnde Leistung
            if (dataEntity.activePowerJpaToBeReduced) {

                tmp += $scope.getDetailEntry('DETAILS.REDUCTIONPOWER', dataEntity.activePowerJpaToBeReduced.value + " " +
                    dataEntity.activePowerJpaToBeReduced.multiplier + dataEntity.activePowerJpaToBeReduced.unit);
            }

            //Abregelvorschlag
            if (dataEntity.synchronousMachineJpaReducedList && dataEntity.synchronousMachineJpaReducedList.length > 0) {
                tmpContent = '';

                dataEntity.synchronousMachineJpaReducedList.forEach(function (column) {

                    tmpContent += column.name;
                    tmpContent += '</br>';

                });
                tmp += $scope.getDetailEntry('DETAILS.CHOOSENAREA', tmpContent);
            }

            $scope.detailHTML = $sce.trustAsHtml(tmp);

        };

        $scope.getDetailEntry = function (head, content) {

            return $scope.detailTemplate.replace('{head}', $translate.instant(head)).replace('{content}', content);
        };

        // Methode zum Laden der serverseitigen Daten
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

            //params.activityId = $scope.getParam('activityId');

            var id = $state.params.activityId;

            // Request absenden
            $http.get('app/finddetailactivitylist' + $state.params.activityId + '.json').then(function(result){
                $scope.detail.data = result.data.content;
            }, function(error){
                alert(JSON.stringify(error))
            });
/*
            $http.get("/openk-eisman-portlet/rest/finddetailactivitiylist/" + $scope.getParam('activityId'), {
                "timeout": 30000,
                "params": params
            }).success(function (data) {
                $log.info("Success");
                $scope.detail.data = data.content;
            }).
                error(function (data, status, headers, config) {
                    $rootScope.$broadcast('displayError', 'Es gab einen Fehler bei der Datenabfrage.');
                });
*/
        };

        $scope.getDataAsync();

    }]);
