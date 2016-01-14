app.controller('NetworkMainStateInfoController', ['$scope', '$http', '$log', '$rootScope', '$translate', 'modalServiceNew', function ($scope, $http, $log, $rootScope, $translate, modalServiceNew) {

        $scope.handleTreeClick = function (branch) {
        
            if (branch && branch.level > 1) {
                $scope.$parent.$broadcast('loadSubstationsInfo', branch);
                $scope.$parent.substationName = branch.name;
            }
        };

        $scope.treeColumns = [{
                field: "name",
                displayName: $translate.instant('STATE.NETWORK'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor">{{row.branch[col.field]| translate}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "pv",
                displayName: $translate.instant('STATE.PV'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellFilter: 'number: 2',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "bio",
                displayName: $translate.instant('STATE.BIO'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "wind",
                displayName: $translate.instant('STATE.WIND'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "noBioPvWind",
                displayName: $translate.instant('STATE.ELSE'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "sum",
                displayName: $translate.instant('STATE.SUM'),
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }
/*
            , {
                field: "select",
                displayName: ' ',
                cellTemplate: '<button ng-hide="row.branch.level === 1" data-target="#spg" data-parent="#stats" data-toggle="collapse" class="btn btn-default btn-xs" ng-click="cellTemplateScope.click( row.branch )" type="button">' +
                        '<span aria-hidden="true" class="glyphicon glyphicon-stats"></span>' +
                        '</button>',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }
*/

        ];
        $scope.orderSubstations = function (response) {
            for (var i = 0; i < response.length; i++) {

                response[i].children.sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }

            return response;
        };
        $scope.treeData = [];
        $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/tree/").then(function (result) {
            $scope.treeData = $scope.orderSubstations(result.data);
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', { show: 'Aktiv' });
            });
        });

        /**
         * Sums the Power of the Element (bio, pv and wind)
         * @param data
         * @returns data
         */
        $scope.sumPower = function (data) {
            angular.forEach(data, function (value, key) {
                var sum;
                value.sum = parseFloat(value.pv) + parseFloat(value.wind) + parseFloat(value.bio);
                if (value.children && value.children.length > 0 && typeof value.children === 'object') {
                    value.children = $scope.sumPower(value.children);
                }
            });
            return data;
        };
    }]);