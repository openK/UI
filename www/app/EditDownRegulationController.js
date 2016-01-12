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
    $scope.activity = activityService.childActivity();
    $scope.parentActivityId = activityService.currentParentActivity();
    $scope.preselectionFormSubmitted = false;

    $scope.$watch('activity.characteristicForMissingMeasurementFwt', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        if (newValue !== 'SubstituteWithInputFactor') {
            $scope.activity.substituteValueBiogasFwt = null;
            $scope.activity.substituteValuePhotovoltaicFwt = null;
            $scope.activity.substituteValueWindFwt = null;
        } else {
            $scope.loadTemplateData($rootScope.selectedTemplate);
        }
    });
    $scope.$watch('activity.characteristicForMissingMeasurementEfr', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        if (newValue !== 'SubstituteWithInputFactor') {
            $scope.activity.substituteValueWindEfr = null;
            $scope.activity.substituteValuePhotovoltaicEfr = null;
            $scope.activity.substituteValueBiogasEfr = null;
        } else {
            $scope.loadTemplateData($rootScope.selectedTemplate);
        }
    });

    $scope.gotoSettings = function (preselectionForm) {
        if (preselectionForm.$valid) {
            $state.go('EditRegulation.EditSettings');
        } else {
            $rootScope.CanNavigateToEditSettings = false;
            $scope.preselectionFormSubmitted = true;
        }
        return false;
    };

    $scope.openModal = function (preselectionForm) {
        $modal.open({
            animation: true,
            templateUrl: templPath + 'PreselectionModal.html',
            controller: 'PreselectionModalController',
        });
    };
}]);
