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

app.controller('NetworkStateController', ['$scope', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', '$rootScope', function ($scope, $http, $timeout, $translate, uiGridConstants, $log, $rootScope) {

    $scope.handleTreeClick = function (branch) {

        if (branch && branch.level > 1) {

            $rootScope.$broadcast('loadSubstations', branch);
        }
    };

    $scope.treeColumns = [{
        field: "name",
        displayName: $translate.instant('STATE.NETWORK')
    }, {
        field: "pv",
        displayName: $translate.instant('STATE.PV'),
        cellTemplate: '<div ng-click="cellTemplateScope.click({{ row.branch }})">{{row.branch[col.field] | number: 2}} MW</div>\n',
        cellFilter: 'number: 2',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }, {
        field: "bio",
        displayName: $translate.instant('STATE.BIO'),
        cellTemplate: '<div ng-click="cellTemplateScope.click({{ row.branch }})">{{row.branch[col.field] | number: 2}} MW</div>\n',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }, {
        field: "wind",
        displayName: $translate.instant('STATE.WIND'),
        cellTemplate: '<div ng-click="cellTemplateScope.click({{ row.branch }})">{{row.branch[col.field] | number: 2}} MW</div>\n',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }, {
        field: "noBioPvWind",
        displayName: $translate.instant('STATE.ELSE'),
        cellTemplate: '<div ng-click="cellTemplateScope.click({{ row.branch }})">{{row.branch[col.field] | number: 2}} MW</div>\n',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }, {
        field: "sum",
        displayName: $translate.instant('STATE.SUM'),
        cellTemplate: '<div ng-click="cellTemplateScope.click({{ row.branch }})">{{row.branch[col.field] | number: 2}} MW</div>\n',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }, {
        field: "select",
        displayName: ' ',
        cellTemplate: '<button ng-hide="row.branch.level === 1" data-target="#spg" data-parent="#stats" data-toggle="collapse" class="btn btn-default btn-xs" ng-click="cellTemplateScope.click({{ row.branch }})" type="button">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-stats"></span>' +
        '</button>',
        cellTemplateScope: {
            click: $scope.handleTreeClick
        }
    }];

    $scope.treeData = [];

    $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/tree/", {
        "timeout": 30000
    }).success(function (data) {
        $scope.treeData = data;
    }).error(function (data, status, headers, config) {
        $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
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
