app.controller('NetworkMainStateInfoController', ['$scope', '$http', '$log', '$rootScope', '$translate', function ($scope, $http, $log, $rootScope, $translate) {

        $scope.handleTreeClick = function (branch) {
        
            if (branch && branch.level > 1) {
                $rootScope.$broadcast('loadSubstationsInfo', branch);
                $log.log(branch.name);
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

        $scope.treeData = [];
        $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/tree/").then(function (result) {
            $scope.treeData = result.data;
        }, function (error) {
            $log.error('Can not load /openk-eisman-portlet/rest/subgeographicalregion/tree/');
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