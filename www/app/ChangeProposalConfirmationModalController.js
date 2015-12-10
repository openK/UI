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
app.controller('ChangeProposalConfirmationModalController', ['$scope', '$state', '$rootScope', '$modalInstance', '$http', '$filter', 'activityService', 'dateService', function ($scope, $state, $rootScope, $modalInstance, $http, $filter, activityService, dateService) {

    $scope.activity = activityService.activity();

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

    $scope.activity.proposal.modal.diffReductionPower = $scope.activity.reductionValue - $scope.activity.proposal.modal.sumRequiredReductionPower;

    if ($scope.activity.proposal.modal.diffReductionPower < 0) {

        $scope.enough = "green";
        $scope.activity.proposal.modal.diffReductionPower *= -1;

    } else {

        $scope.enough = "red";
    }

    //$scope.activity.proposal.modal.requiredReductionPowerWithSaving = $scope.activity.settings.requiredReductionPower + $scope.activity.settings.requiredReductionPower * ($scope.activity.preselection.securityFactorForReduction / 100);

    //$scope.activity.proposal.modal.requiredReductionPowerWithSaving = $filter('number')($scope.activity.proposal.modal.requiredReductionPowerWithSaving, 2);
    $scope.activity.proposal.modal.diffReductionPower = $filter('number')($scope.activity.proposal.modal.diffReductionPower, 2);
    $scope.activity.proposal.modal.requiredReductionPower = $filter('number')($scope.activity.requiredReductionPower, 2);
    $scope.activity.proposal.modal.sumRequiredReductionPower = $filter('number')($scope.activity.proposal.modal.sumRequiredReductionPower, 2);

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        var dateStarted = dateService.formatDateForBackend($scope.activity.dateStarted);
        var dateFinished = dateService.formatDateForBackend($scope.activity.dateFinished);
        var dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var postData = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateCreated": dateCreated,
            "createdBy": $scope.activity.createdBy || 'openk',
            "userSettingsJpa": {
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "geographicalRegion": $scope.activity.pointOfInjectionType,
                "reasonOfReduction": $scope.activity.reasonOfReduction,
                "practise": $scope.activity.practise,
                "description": $scope.activity.description
            },
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.reductionValue,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": $scope.activity.subGeographicalRegions,
            "substationJpaList": $scope.activity.transformerStations,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselectionConfigurationDto.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselectionConfigurationDto.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.preselectionConfigurationDto.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.preselectionConfigurationDto.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselectionConfigurationDto.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.preselectionConfigurationDto.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.preselectionConfigurationDto.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.preselectionConfigurationDto.substituteValueBiogasEfr
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
        };

        $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

            $state.go('Regulation.CreateProposalConfirmation');

        }).error(function (data, status, headers, config) {

            $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
            $log.error('Can not load /openk-eisman-portlet/rest/activity/');

        });

        $modalInstance.close();
    };
}]);