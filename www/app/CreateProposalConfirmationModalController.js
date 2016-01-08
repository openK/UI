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
app.controller('CreateProposalConfirmationModalController', ['$scope', '$state', '$rootScope', '$modalInstance', '$http', '$filter', 'activityService', 'dateService', function ($scope, $state, $rootScope, $modalInstance, $http, $filter, activityService, dateService) {

    $scope.activity = activityService.activity();
    var hysteresis = activityService.activityConfigData().activity.hysteresis || 5;

    $scope.enough = "";
    $scope.activity.proposal = {};
    $scope.activity.proposal.modal = {};
    $scope.activity.proposal.modal.sumRequiredReductionPower = 0;
    $scope.activity.proposal.modal.diffReductionPower = 0;
    //$scope.activity.proposal.modal.requiredReductionPowerWithSaving = 0;
    $scope.activity.proposal.modal.requiredReductionPower = 0;

    $scope.activity.substationProposalList.forEach(function (value, key) {

        //$scope.activity.proposal.modal.sumRequiredReductionPower += parseFloat(value.getCalculatedPower);
        $scope.activity.proposal.modal.sumRequiredReductionPower += parseFloat(value.activePowerJpaToBeReduced.value);
    });

    $scope.activity.proposal.modal.diffReductionPower = $scope.activity.proposal.modal.sumRequiredReductionPower - $scope.activity.settings.requiredReductionPower;
    var red = $scope.activity.settings.requiredReductionPower * hysteresis / 100;
    if ($scope.activity.proposal.modal.diffReductionPower <= 0 || $scope.activity.proposal.modal.diffReductionPower > red) {
        $scope.enough = "red";
    }

    //$scope.activity.proposal.modal.requiredReductionPowerWithSaving = $scope.activity.settings.requiredReductionPower + $scope.activity.settings.requiredReductionPower * ($scope.activity.preselection.securityFactorForReduction / 100);

    //$scope.activity.proposal.modal.requiredReductionPowerWithSaving = $filter('number')($scope.activity.proposal.modal.requiredReductionPowerWithSaving, 2);
    $scope.activity.proposal.modal.diffReductionPower = $filter('number')($scope.activity.proposal.modal.diffReductionPower, 2);
    $scope.activity.proposal.modal.requiredReductionPower = $filter('number')($scope.activity.settings.requiredReductionPower, 2);
    $scope.activity.proposal.modal.sumRequiredReductionPower = $filter('number')($scope.activity.proposal.modal.sumRequiredReductionPower, 2);

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };
    $scope.activity.dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
    $scope.dateCreated = $filter('date')(new Date($scope.activity.dateCreated), 'dd.MM.yyyy HH:mm');

    $scope.ok = function () {
        var dateStarted = dateService.formatDateForBackend($scope.activity.settings.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.settings.dateFinished);
        var postData = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateCreated": $scope.activity.dateCreated,
            "createdBy": $scope.activity.createdBy || 'openk',
            "userSettingsJpa": {
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "geographicalRegion": $scope.activity.settings.useWholeArea,
                "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
                "practise": $scope.activity.settings.practise,
                "description": $scope.activity.settings.description
            },
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselection.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselection.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselection.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselection.substituteValueBiogasEfr
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
        };

        //$http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

            $state.go('Regulation.CreateProposalConfirmation');

        //}).error(function (data, status, headers, config) {

        //    $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
        //    $log.error('Can not load /openk-eisman-portlet/rest/activity/');

        //});

        $modalInstance.close();
    };
}]);