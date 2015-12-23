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
app.controller('EditProposalConfirmationModalController', ['$scope', '$state', '$rootScope', '$modalInstance', '$http', '$filter', 'activityService', 'dateService', '$log', function ($scope, $state, $rootScope, $modalInstance, $http, $filter, activityService, dateService, $log) {

    $scope.activity = activityService.activity();
    var hysteresis = activityService.activityConfigData().activity.hysteresis || 5;

    $scope.enough = "";
    $scope.activity.proposal = {};
    $scope.activity.proposal.modal = {};
    $scope.activity.proposal.modal.sumRequiredReductionPower = 0;
    $scope.activity.proposal.modal.diffReductionPower = 0;
    $scope.activity.proposal.modal.requiredReductionPower = 0;

    $scope.activity.substationProposalList.forEach(function (value, key) {

        //$scope.activity.proposal.modal.sumRequiredReductionPower += parseFloat(value.getCalculatedPower);
        $scope.activity.proposal.modal.sumRequiredReductionPower += parseFloat(value.activePowerJpaToBeReduced.value);
    });

    $scope.activity.proposal.modal.diffReductionPower = $scope.activity.proposal.modal.sumRequiredReductionPower - $scope.activity.reductionValue;
    var red = $scope.activity.settings.requiredReductionPower * hysteresis / 100;
    if ($scope.activity.proposal.modal.diffReductionPower < 0 || $scope.activity.proposal.modal.diffReductionPower > red) {
        $scope.enough = "red";
    }

    $scope.activity.proposal.modal.diffReductionPower = $filter('number')($scope.activity.proposal.modal.diffReductionPower, 2);
    $scope.activity.proposal.modal.requiredReductionPower = $filter('number')($scope.activity.reductionValue, 2);
    $scope.activity.proposal.modal.sumRequiredReductionPower = $filter('number')($scope.activity.proposal.modal.sumRequiredReductionPower, 2);

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };
    $scope.dateStarted = $filter('date')(new Date($scope.activity.dateStarted), 'dd.MM.yyyy HH:mm');
    $scope.dateFinished = $filter('date')(new Date($scope.activity.dateFinished), 'dd.MM.yyyy HH:mm');
    $scope.activity.dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
    $scope.dateCreated = $filter('date')(new Date($scope.activity.dateCreated), 'dd.MM.yyyy HH:mm');
    $scope.ok = function () {
        var postData = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateCreated": $scope.activity.dateCreated,
            "createdBy": $scope.activity.createdBy || 'openk',
            "userSettingsJpa": {
                "dateStarted": $scope.activity.dateStarted,
                "dateFinished": $scope.activity.dateFinished,
                "geographicalRegion": $scope.activity.useWholeArea,
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

            $state.go('EditRegulation.EditProposalConfirmation');

        }).error(function (data, status, headers, config) {

            $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
            $log.error('Can not load /openk-eisman-portlet/rest/activity/');

        });

        $modalInstance.close();
    };
}]);