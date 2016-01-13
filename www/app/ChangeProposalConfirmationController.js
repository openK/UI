app.controller('ChangeProposalConfirmationController', ['$scope', '$state', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', 'activityService', 'modalServiceNew', function ($scope, $state, $http, $timeout, $translate, uiGridConstants, $log, activityService, modalServiceNew) {

    $scope.activity = activityService.childActivity();

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
        enablePagination: false,
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        showGridFooter: false,
        showColumnFooter: true,
        paginationPageSizes: [10],
        paginationPageSize: 10,
        enablePaginationControls: false,
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
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.maxU.value | kv}} {{row.entity.maxU.multiplier}}{{row.entity.maxU.unit}}</div>',
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
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.reductionSettingMeasured.value | number : 0}} %</div>',
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
                name: 'generatorPowerMeasured.value',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.generatorPowerMeasured.value | number : 2}} {{row.entity.generatorPowerMeasured.multiplier}}{{row.entity.generatorPowerMeasured.unit}}</div>',
                headerCellFilter: 'translate',
                displayName: 'SUBSTATIONSGRID.GENERATORVOLTAGE.MEASURED.ABBREVIATION',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                width: '9%'
            },
            // abregeln auf
            {
                name: 'reductionAdvice',
                cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.reductionAdvice | number : 0}} %</div>',
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
            $scope.gridApi2 = gridApi;
        }
    };

    $scope.saveActivity = function () {
        var postData = {
            "id": $scope.activity.id
        };

        $scope.activity.calculatedReductionAdvice.subGeographicalRegionJpaList.forEach(function (item) {
            if (item.children) {
                delete item.children;
            }
        });

        $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/confirmactivity/", $scope.activity.calculatedReductionAdvice).then(function (result) {
            $state.go('state1', {show: 'Aktiv'});
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', { show: 'Aktiv' });
            });
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
