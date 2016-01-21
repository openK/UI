app.controller('NetworkMainStateController', ['$scope', '$http', '$log', '$rootScope', '$translate', 'modalServiceNew', 'activityService', 'dateService', function ($scope, $http, $log, $rootScope, $translate, modalServiceNew, activityService, dateService) {

        var activity = activityService.childActivity();
        var transformerStationsArray = [];

        for (var i = 0; i < activity.calculatedReductionAdvice.substationJpaList.length; i++) {
            transformerStationsArray.push(activity.calculatedReductionAdvice.substationJpaList[i].name);
        }

        $log.debug(activity);
        $scope.handleTreeClick = function (branch) {

            if (branch && branch.level > 1) {
                $scope.$parent.$broadcast('loadSubstations', branch);
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
        //$scope.orderSubstations = function (response) {
        //    for (var i = 0; i < response.length; i++) {
        //        response[i].children = response[i].substationJpaList;
        //        response[i].children.sort(function (a, b) {
        //            if (!a.name) {
        //                a.name = "Virtuelles Umspannwerk"
        //            }
        //            if (!b.name) {
        //                b.name = "Virtuelles Umspannwerk"
        //            }
        //            if (a.name < b.name) {
        //                return -1;
        //            } else {
        //                return 1;
        //            }
        //        });
        //    }

        //    return response;
        //};

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

        var timestamp = dateService.formatDateForRestRequest($scope.activity.dateCreated);
        $log.debug(activity.preselectionConfigurationJpa);
        $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/tree/timestamp/" + timestamp + "/", activity.calculatedReductionAdvice.preselectionConfigurationJpa).then(function (result) {

            var treeData = $scope.orderSubstations(result.data);
            if (transformerStationsArray.length > 0) {
                for (var i = 0; i < treeData.length; i++) {
                    reducedData = [];
                    for (var j = 0; j < treeData[i].children.length; j++) {
                        if (transformerStationsArray.indexOf(treeData[i].children[j].name) > -1) {
                            reducedData.push(treeData[i].children[j]);
                        }
                    }
                    treeData[i].children = reducedData;
                }
            }
            $scope.treeData = treeData;
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', {show: 'Aktiv'});
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