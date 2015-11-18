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

app.controller('CreateProposalController', ['$scope', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', '$rootScope', 'activityService', function ($scope, $http, $timeout, $translate, uiGridConstants, $log, $rootScope, activityService) {

    $rootScope.$on('showSubstationProposalGrid', function (event, row, job, subStationRegStep) {

        $log.info('showSubstationProposalGrid ' + job);

        if (job === 'add') {

            var add = true;

            $scope.activity.substationProposalList.forEach(function (value, key) {

                if (value.mRid === row.entity.mRid) {
                    add = false;
                }
            });

            if (add) {

                row.entity.reductionAdvice = row.entity.subStationRegSteps;
                row.entity.activePowerJpaToBeReduced = {
                    value: row.entity.generatorVoltageMeasured.value - (row.entity.reductionAdvice / 100 * row.entity.generatingUnitJpa.maxOperatingP.value),
                    multiplier: "M",
                    unit: "W"
                };

                $scope.activity.substationProposalList.push(row.entity);
            }
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

    $scope.substations = {
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
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 2, // 0: never, 1: always, 2: when needed
        data: "activity.substationProposalList",
        columnDefs: [
            {
                name: 'generatingUnitJpa.registeredGeneratorJpa.unitTypeJpa',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.TECHNICALTYPE.ABBREVIATION',
                width: '4%'
            },
            {
                name: 'maxU.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.maxU.value | number : 2}} {{row.entity.maxU.multiplier}}{{row.entity.maxU.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.NETAREA',
                width: '5%'
            },
            {
                name: 'communicationTypeJpa',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.COMMUNICATIONTYPE.ABBREVIATION',
                width: '6%'
            },
            {
                name: 'locationJpa.mainAddress.postalCode',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.ZIP',
                width: '4%'
            },
            { name: 'name', headerCellFilter: 'translate', displayName: 'SUBSTATIONSGRID.STATIONNAME', width: '18%' },
            {
                name: 'feedInRanking',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.RANKORDER.ABBREVIATION',
                width: '4%'
            },
            {
                name: 'feedInPriority',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.PRIORITYFACTOR.ABBREVIATION',
                width: '4%'
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
            },
            // abregeln auf
            {
                name: 'reductionAdvice',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.reductionAdvice | number : 2}} %</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCTIONSETTING.TO.SET'
            },
            // abgeregelte Leistung
            {
                name: 'activePowerJpaToBeReduced.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.activePowerJpaToBeReduced.value | number : 2}} MW</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCEDPOWER',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>'
            },
            {
                name: 'change',
                displayName: 'SUBSTATIONSGRID.CHANGE',
                headerCellFilter: 'translate',
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><div class="input-group input-group-sm"><select id="regulationSteps" ng-model="row.entity.subStationRegSteps" style="padding-top:2px;" class="form-control" ng-change="grid.appScope.changeSynchronousMachine(grid,row)"><option ng-repeat="item in row.entity.reductionSettingJpaList">{{item.setting.value}}</option></select></div></div>'
            },
            {
                name: 'delete',
                displayName: 'SUBSTATIONSGRID.DELETE',
                headerCellFilter: 'translate',
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents" title="TOOLTIP"><button type="button" class="btn btn-default btn-xs" aria-label="Left Align" ng-click="grid.appScope.removeSubStation(grid,row)"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button></div>'
            }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $timeout(function () {
        if ($scope.activity.substationProposalList) {

            var entity = $scope.activity.substationProposalList[0];

            $scope.activity.substationProposalList.push(entity);

            $timeout(function () {

                $scope.activity.substationProposalList.splice(-1, 1);

            }, 250);
        }
    }, 250);

    /**
     * removes a Substation from the proposalList
     * @param grid
     * @param myRow
     */
    // todo: re-name removeSynchronousMachine
    $scope.removeSubStation = function (grid, myRow) {

        $log.info('removeSubStation');

        var mRid = myRow.entity.mRid;
        var row = {};

        $scope.activity.substationProposalList.forEach(function (value, key) {

            if (value.mRid === mRid) {

                row = $scope.activity.substationProposalList[key];
                $scope.activity.substationProposalList.splice(key, 1);
            }
        });

        $rootScope.$broadcast('showSubstationGrid', row, $scope.activity.substationProposalList, 'remove');
    };

    $scope.changeSynchronousMachine = function (grid, row) {

        row.entity.reductionAdvice = row.entity.subStationRegSteps;
        row.entity.activePowerJpaToBeReduced = {
            value: row.entity.generatorVoltageMeasured.value - (row.entity.reductionAdvice / 100 * row.entity.generatingUnitJpa.maxOperatingP.value),
            multiplier: "M",
            unit: "W"
        };
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    };

    $scope.getPostData = function () {

        var data = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateStarted": dateService.formatDateForBackend($scope.activity.settings.dateStarted),
            "dateFinished": dateService.formatDateForBackend($scope.activity.settings.dateFinished),
            "description": $scope.activity.settings.reason,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "practice": $scope.activity.settings.training,
            'geographicalRegion': $scope.activity.settings.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselection.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselection.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselection.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselection.substituteValueBiogasEfr
            },
            "timeout": 30000
        };

        return data;
    };

    if (typeof $scope.activityId === "undefined") {

        $scope.activityId = null;
    }

    $rootScope.deregisterOnGoToConfirm = $rootScope.$on('gotoConfirm', function (event, args) {

        var postData = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateCreated": $scope.activity.dateCreated,
            "createdBy": $scope.activity.createdBy,
            "dateStarted": dateService.formatDateForBackend($scope.activity.settings.dateStarted),
            "dateFinished": dateService.formatDateForBackend($scope.activity.settings.dateFinished),
            "description": $scope.activity.settings.reason,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "practice": $scope.activity.settings.training,
            'geographicalRegion': $scope.activity.settings.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
            "timeout": 30000
        };

        $http.put("/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

            $scope.gotoConfirm();

        }).error(function (data, status, headers, config) {

            $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
            $log.error('Can not load /openk-eisman-portlet/rest/activity/');

        });

    });

    /*
     $rootScope.$on('reCalculateAfterTimeout', function(event, args) {

     $http.post("/openk-eisman-portlet/rest/activity/createreductionadvice",  $scope.getPostData()).success(function (payload) {
     $scope.parentActivityId = payload.id;
     $scope.activityId = payload.childrenActivityJPaList[0].id;
     $scope.activity.calculatedReductionAdvice = payload;
     $scope.activity.substationProposalList = payload.childrenActivityJpaList[0].synchronousMachineJpaReducedList;
     $rootScope.$broadcast('showSubstationProposalGrid', [], 'refresh');

     }).error(function(data, status, headers, config) {
     $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
     $log.error('Can not load /openk-eisman-portlet/rest/activity/createreductionadvice/');
     });
     });
     */

}]);
