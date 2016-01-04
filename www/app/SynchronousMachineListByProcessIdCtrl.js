app.controller('SynchronousMachineListByProcessIdCtrl', ['$scope', '$state', '$rootScope', '$http', '$modal', '$log', 'activityService', 'uiGridConstants', function ($scope, $state, $rootScope, $http, $modal, $log, activityService, uiGridConstants) {

        var mock = [];

        $scope.substations = {
            enableFiltering: true,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableColumnMenus: false,
            noUnselect: true,
            showGridFooter: false,
            showColumnFooter: false,
            minRowsToShow: 11,
            paginationPageSizes: [10],
            paginationPageSize: 10,
            enablePaginationControls: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 0, // 0: never, 1: always, 2: when needed
            data: mock,
            columnDefs: [
                {
                    name: 'seqNum',
                    headerCellFilter: 'translate',
                    displayName: 'Maßnahme',
                    width: '8%'
                },
                {
                    name: 'dateStarted',
                    headerCellFilter: 'translate',
                    displayName: 'von',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    width: '8%'
                },
                {
                    name: 'dateFinished',
                    headerCellFilter: 'translate',
                    cellFilter: "date : 'dd.MM.yyyy HH:mm'",
                    displayName: 'bis',
                    width: '8%'
                },
                {
                    name: 'unitType',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.TECHNICALTYPE.ABBREVIATION',
                    width: '4%'
                },
                {
                    name: 'netVoltage.value',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope">{{row.entity.netVoltage.value | kv}} {{row.entity.netVoltage.multiplier}}{{row.entity.netVoltage.unit}}</div>',
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
                    name: 'postalCode',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.ZIP',
                    width: '4%'
                },
                {
                    name: 'name',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.STATIONNAME'
                },
                {
                    name: 'bdew',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.RANKORDER.ABBREVIATION',
                    width: '4%'
                },
                {
                    name: 'prio',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.PRIORITYFACTOR.ABBREVIATION',
                    width: '4%'
                },
                // Installierte Leistung
                {
                    name: 'maxOperatingPower.value',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.maxOperatingPower.value | number : 2}} {{row.entity.maxOperatingPower.multiplier}}{{row.entity.maxOperatingPower.unit}}</div>',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.INSTALLEDPOWER.ABBREVIATION',
                    // aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                    width: '9%'
                },
                // abgeregelte Leistung
                {
                    name: 'reducedPower.value',
                    cellTemplate: '<div class="ui-grid-cell-contents ng-binding ng-scope ui-grid-cell-align-right">{{row.entity.reducedPower.value | number : 2}} {{row.entity.reducedPower.multiplier }}{{row.entity.reducedPower.unit }}</div>',
                    headerCellFilter: 'translate',
                    displayName: 'SUBSTATIONSGRID.REDUCEDPOWER',
                    // aggregationType: uiGridConstants.aggregationTypes.sum,
                    footerCellTemplate: '<div class="ui-grid-cell-contents">∑ {{col.getAggregationValue() | number : 2}} MW</div>',
                    width: '10%'
                }

            ],
            onRegisterApi: function (gridApi) {
                $scope.currentPage = 1;
                $scope.gridApi2 = gridApi;
            }
        };
        var url = Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/synchronousmaschinelistbyprocess/" + $scope.$parent.modalOptions.id;
        $http.get(url).then(function (response) {
            $scope.substations.data = response.data.content;
            $log.debug(response.data.content);
        });
    }]);