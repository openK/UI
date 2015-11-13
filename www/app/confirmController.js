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

app.controller('ConfirmController', ['$scope', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', '$rootScope', function ($scope, $http, $timeout, $translate, uiGridConstants, $log, $rootScope) {

    $rootScope.deregisterOnGoToConfirm();

    $scope.searchOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        sortColumn: '',
        filter: {
            filter: []
        }
    };

    $scope.regulationSteps = $scope.$parent.regulationSteps;

    $scope.substations = {
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
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
                displayName: 'SUBSTATIONSGRID.TECHNICALTYPE'
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
            {name: 'name', headerCellFilter: 'translate', displayName: 'SUBSTATIONSGRID.STATIONNAME', width: '18%'},
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
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.reductionSettingMeasured.value | number : 2}} %</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCTIONSETTING.MEASURED.ABBREVIATION',
                width: '9%'
            },
            // Installierte Leistung
            {
                name: 'generatingUnitJpa.maxOperatingP.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.generatingUnitJpa.maxOperatingP.value | number : 2}} {{row.entity.generatingUnitJpa.maxOperatingP.multiplier}}{{row.entity.generatingUnitJpa.maxOperatingP.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.INSTALLEDPOWER.ABBREVIATION',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                width: '9%'
            },
            // Aktuelle Wirkleistung
            {
                name: 'generatorVoltageMeasured.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.generatorVoltageMeasured.value | number : 2}} {{row.entity.generatorVoltageMeasured.multiplier}}{{row.entity.generatorVoltageMeasured.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.GENERATORVOLTAGE.MEASURED.ABBREVIATION',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                width: '9%'
            },
            // abregeln auf
            {
                name: 'reductionAdvice',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.reductionAdvice | number : 2}} %</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCTIONSETTING.TO.SET'
            },
            // abgeregelte Leistung
            {
                name: 'activePowerJpaToBeReduced.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align">{{row.entity.activePowerJpaToBeReduced.value | number : 2}} MW</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.REDUCEDPOWER',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>'
            }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.saveActivity = function () {
        var postData = {
            "id": $scope.activityId
        };

        $http.put("/openk-eisman-portlet/rest/confirmactivity/", postData).success(function (data) {
            window.location.search = '';
            //window.location.search = '?page=details&activityId=' + $scope.parentActivityId;
        }).error(function (data, status, headers, config) {
            $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
            $log.error('Can not load /openk-eisman-portlet/rest/confirmactivity/');
        });
    };

    $timeout(function () {
        if ($scope.activity.substationProposalList) {

            var entity = $scope.activity.substationProposalList[0];

            //entity.mRid = 'tmpDel';

            $scope.activity.substationProposalList.push(entity);

            $timeout(function () {

                $scope.activity.substationProposalList.splice(-1, 1);

            }, 250);
        }
    }, 250);
}]);
