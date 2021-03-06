app.controller('NetworkMainStateController', ['$scope', '$http', '$log', '$rootScope', '$translate', 'modalServiceNew', 'activityService', function ($scope, $http, $log, $rootScope, $translate, modalServiceNew, activityService) {

        var transformerStations = activityService.childActivity().transformerStations;
        var transformerStationsArray = [];
        for (var key in transformerStations) {
            transformerStationsArray.push(transformerStations[key].name);
        }

        $scope.handleTreeClick = function (branch) {

            if (branch && branch.level > 1) {
                $scope.$parent.$broadcast('loadSubstations', branch);
                $scope.$parent.substationName = branch.name;
            }
        };

        $scope.treeColumns = [{
                field: "name",
                displayName: 'Netz',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor">{{row.branch[col.field]| translate}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "pv",
                displayName: 'PV',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellFilter: 'number: 2',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "bio",
                displayName: 'Bio',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "wind",
                displayName: 'Wind',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "noBioPvWind",
                displayName: 'Sonstige',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }, {
                field: "sum",
                displayName: '∑',
                cellTemplate: '<div ng-click="cellTemplateScope.click( row.branch )" class="cursor align-right">{{row.branch[col.field] | number: 2}}</div>\n',
                cellTemplateScope: {
                    click: $scope.handleTreeClick
                }
            }
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

            var treeData = $scope.orderSubstations(result.data);
            if (transformerStationsArray.length > 0) {
                for (var i = 0; i < treeData.length; i++) {
                    reducedData = [];
                    for (var j = 0; j < treeData[i].children.length; j++) {
                        if(transformerStationsArray.indexOf(treeData[i].children[j].name) > -1){
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