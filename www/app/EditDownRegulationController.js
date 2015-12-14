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
app.controller('EditDownRegulationController', ['$scope', '$state', '$rootScope', '$http', '$modal', '$log', 'activityService', function ($scope, $state, $rootScope, $http, $modal, $log, activityService) {

    $scope.activityConfigData = activityService.activityConfigData();
    $scope.activity = activityService.activity();
    $scope.parentActivityId = activityService.currentParentActivity();
    $scope.preselectionFormSubmitted = false;

    $scope.gotoSettings = function (preselectionForm) {
        if (preselectionForm.$valid) {
            $state.go('EditRegulation.EditSettings');
        } else {

            $scope.preselectionFormSubmitted = true;
        }
        return false;
    };

    $scope.openModal = function (preselectionForm) {
        $modal.open({
            animation: true,
            templateUrl: 'app/PreselectionModal.html',
            controller: 'PreselectionModalController',
        });
    };
}]);