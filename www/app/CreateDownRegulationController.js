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
app.controller('CreateDownRegulationController', ['$scope', '$state', '$rootScope', '$http', '$modal', '$log', 'activityService', '$timeout', function ($scope, $state, $rootScope, $http, $modal, $log, activityService, $timeout) {
    $scope.activityConfigData = activityService.activityConfigData();
    $scope.activity = activityService.childActivity();
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

    $scope.$watch('preselectionForm.$invalid', function (newValue, oldValue) {
        if (newValue === oldValue) {
            return;
        }
        $rootScope.preselectionFormInValid = newValue;
    });

    /*
    * Preselection Data
    */
    $rootScope.selectedTemplate = $rootScope.selectedTemplate || '';
    $rootScope.templates = $scope.activityConfigData.templates;
    $scope.regulationSteps = $scope.activityConfigData.regulationSteps;
    /*
    * Preselection Functions
    */
    $scope.loadTemplateData = function (selectedTemplate) {

        if (selectedTemplate) {
            $rootScope.selectedTemplate = selectedTemplate;
            $scope.activity.reductionSetting = selectedTemplate.preselectionConfigurationJpa.reductionSetting;
            $scope.activity.discriminationCoefficientEnabled = selectedTemplate.preselectionConfigurationJpa.discriminationCoefficientEnabled;
            $scope.activity.characteristicForMissingMeasurementFwt = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementFwt;
            $scope.activity.substituteValuePhotovoltaicFwt = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicFwt;
            $scope.activity.substituteValueWindFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueWindFwt;
            $scope.activity.substituteValueBiogasFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasFwt;
            $scope.activity.characteristicForMissingMeasurementEfr = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementEfr;
            $scope.activity.substituteValueWindEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueWindEfr;
            $scope.activity.substituteValuePhotovoltaicEfr = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicEfr;
            $scope.activity.substituteValueBiogasEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasEfr;
            $scope.activity.substationProposalList = selectedTemplate.substationJpaList;
        }
    };

    if ($scope.parentActivityId) {
        $scope.activity.parentActivityJpaId = $scope.parentActivityId;
    }

    $scope.preselectionFormSubmitted = false;
    $scope.gotoSettings = function (preselectionForm) {
        if (preselectionForm.$valid) {
            $state.go('Regulation.CreateSettings');
        } else {
            $rootScope.CanNavigateToCreateSettings = false;
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
