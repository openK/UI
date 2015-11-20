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
app.controller('CreateDownRegulationController', ['$scope', '$state', '$rootScope', '$http', '$modal', '$log', 'activityService', function ($scope, $state, $rootScope, $http, $modal, $log, activityService) {

    $scope.activityConfigData = activityService.activityConfigData();

    /*
    * Preselection Data
    */
    $scope.selectedTemplate = $rootScope.selectedTemplate || '';
    $scope.localLang = {};
    $scope.regulationSteps = $scope.activityConfigData.regulationSteps;
    $scope.templates = $scope.activityConfigData.templates;
    /*
    * Preselection Functions
    */
    $scope.loadTemplateData = function (selectedTemplate) {

        if (selectedTemplate) {
            $rootScope.selectedTemplate = selectedTemplate;
            $scope.activity.preselection.reductionSetting = selectedTemplate.preselectionConfigurationJpa.reductionSetting;
            $scope.activity.preselection.discriminationCoefficientEnabled = selectedTemplate.preselectionConfigurationJpa.discriminationCoefficientEnabled;
            $scope.activity.preselection.characteristicForMissingMeasurementFwt = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementFwt;
            $scope.activity.preselection.substituteValuePhotovoltaicFwt = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicFwt;
            $scope.activity.preselection.substituteValueWindFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueWindFwt;
            $scope.activity.preselection.substituteValueBiogasFwt = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasFwt;
            $scope.activity.preselection.characteristicForMissingMeasurementEfr = selectedTemplate.preselectionConfigurationJpa.characteristicForMissingMeasurementEfr;
            $scope.activity.preselection.substituteValueWindEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueWindEfr;
            $scope.activity.preselection.substituteValuePhotovoltaicEfr = selectedTemplate.preselectionConfigurationJpa.substituteValuePhotovoltaicEfr;
            $scope.activity.preselection.substituteValueBiogasEfr = selectedTemplate.preselectionConfigurationJpa.substituteValueBiogasEfr;
            $scope.activity.substationProposalList = selectedTemplate.substationJpaList;
        }
    };

    $scope.activity = activityService.activity();

    if ($scope.parentActivityId) {

        $scope.activity.parentActivityJpaId = $scope.parentActivityId;
    }

    $scope.preselectionFormSubmitted = false;
    $scope.gotoSettings = function (preselectionForm) {
        if (preselectionForm.$valid) {
            $state.go('Regulation.CreateSettings');
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
