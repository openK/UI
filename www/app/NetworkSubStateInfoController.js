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

app.controller('NetworkSubStateInfoController', ['$scope', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', '$rootScope', 'activityService', 'dateService', function ($scope, $http, $timeout, $translate, uiGridConstants, $log, $rootScope, activityService, dateService) {

    function rowTemplate() {
        return '<div ng-class="{ \'hideRowSelectedSubStation\': grid.appScope.isInUse( row )  }">' +
            '<div ng-if="row.entity.merge">{{row.entity.title}}</div>' +
            '<div ng-if="!row.entity.merge" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell>' +
            '</div>' +
            '</div>';
    }
    $scope.activity = activityService.activity();
    $log.log('NetworkSubStateInfoController');
    $log.log($scope.activity);
    $scope.activity = activityService.activity();

    $rootScope.$on('loadSubstationsInfo', function (event, branch) {
        $scope.activity = activityService.activity();
        var oid = parseInt(branch.oid);
        $scope.$parent.substationname = branch.name;
        console.log('loadSubstations');

        if ($scope.activity.dateCreated) {
            var timestamp = dateService.formatDateForRestRequest($scope.activity.dateCreated);
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/oid/" + oid + "/synchronousmachinelist/timestamp/").then(function (result) {
                $scope.substationList = result.data.synchronousMachineJpaList;
            }, function (error) {
                $log.error('Can not load /openk-eisman-portlet/rest/substation/oid/' + oid + '/synchronousmachinelist/timestamp/' + timestamp);
            });
        } else {
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/oid/" + oid + "/synchronousmachinelist").then(function (result) {
                $scope.substationList = result.data.synchronousMachineJpaList;
            }, function (error) {
                $log.error('Can not load /openk-eisman-portlet/rest/substation/oid/' + oid + '/synchronousmachinelist');
            });
        }
    });

    $rootScope.$on('showSubstationGrid', function (event, row, list, job) {
        $log.info('showSubstationGrid');
        if (job === 'remove') {
            $scope.tmpSubstation = list;
            var mRid = row.mRid;
            $scope.substationList.forEach(function (value, key) {
                if (value.mRid === mRid) {
                    $scope.substationList[key].subStationRegSteps = null;
                }
            });
        }
    });

    $scope.searchOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        sortColumn: '',
        filter: {
            filter: []
        }
    };

    $scope.substationList = [];

    $scope.regulationSteps = $scope.$parent.regulationSteps;

    $scope.substations = {
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        enableColumnMenus: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        showGridFooter: false,
        showColumnFooter: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 125,
        enablePagingControls: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0, // 0: never, 1: always, 2: when needed
        data: "substationList",
        rowTemplate: rowTemplate(),
        columnDefs: [
            {
                name: 'generatingUnitJpa.registeredGeneratorJpa.unitTypeJpa',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.TECHNICALTYPE.ABBREVIATION',
                width: '6%'
            },
            {
                name: 'maxU.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.maxU.value | number : 2}} {{row.entity.maxU.multiplier}}{{row.entity.maxU.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.NETAREA',
              //  width: '8%'
            },
            {
                name: 'communicationTypeJpa',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.COMMUNICATIONTYPE.ABBREVIATION',
                width: '8%'
            },
            {
                name: 'locationJpa.mainAddress.postalCode',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.ZIP',
                width: '6%'
            },
            { name: 'name', headerCellFilter: 'translate', displayName: 'SUBSTATIONSGRID.STATIONNAME', width: '23%' },
            {
                name: 'feedInRanking',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.RANKORDER.ABBREVIATION'
               
            },
            {
                name: 'feedInPriority',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.PRIORITYFACTOR.ABBREVIATION',
                width: '6%'
            },
            // Aktuelle Regelstufe
            {
                name: 'reductionSettingMeasured.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.reductionSettingMeasured.value | number : 2}} %</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCTIONSETTING.MEASURED.ABBREVIATION',
                width: '9%'
            },
            // Installierte Leistung
            {
                name: 'generatingUnitJpa.maxOperatingP.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.generatingUnitJpa.maxOperatingP.value | number : 2}} {{row.entity.generatingUnitJpa.maxOperatingP.multiplier}}{{row.entity.generatingUnitJpa.maxOperatingP.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.INSTALLEDPOWER.ABBREVIATION',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                width: '9%'
            },
            // Aktuelle Wirkleistung
            {
                name: 'generatorVoltageMeasured.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.generatorVoltageMeasured.value | number : 2}} {{row.entity.generatorVoltageMeasured.multiplier}}{{row.entity.generatorVoltageMeasured.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.GENERATORVOLTAGE.MEASURED.ABBREVIATION',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                width: '9%'
            }
            
      
            
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    /**
     * adds a new SubStation to the proposalList
     * @param grid
     * @param myRow
     */
    // todo: umbenennen addSynchronousMachine
    $scope.addSubStation = function (grid, myRow) {
        $log.info('addSubstation');

        //add the row to the substationProposalList
        $rootScope.$broadcast('showSubstationProposalGrid', myRow, 'add');
    };

    $scope.isInUse = function (myRow) {

        var disabled = false;
        var tmpSubstations = $scope.activity.substationProposalList;
        if (tmpSubstations) {
            for (var i = 0; i < tmpSubstations.length; i++) {

                if (myRow.entity.mRid === tmpSubstations[i].mRid) {
                    disabled = true;
                    break;
                }
            }
        }
        return disabled;
    };
}]);