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
app.controller('CreateProposalConfirmationModalController',['$scope', '$state', '$rootScope', '$modalInstance', '$http', '$filter', 'activityService', function ($scope, $state, $rootScope, $modalInstance, $http, $filter, activityService) {

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

    $scope.activity.proposal.modal.diffReductionPower = $scope.activity.settings.requiredReductionPower - $scope.activity.proposal.modal.sumRequiredReductionPower;

    if ($scope.activity.proposal.modal.diffReductionPower < 0) {

        $scope.enough = "green";
        $scope.activity.proposal.modal.diffReductionPower *= -1;

    } else {

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

    $scope.ok = function () {
        var dateStarted = $filter('date')($scope.activity.settings.dateStarted, 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var dateFinished = $filter('date')($scope.activity.settings.dateFinished, 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var postData = {
            "id": $scope.activity.id,
            "parentActivityJpaId": $scope.activity.parentActivityJpaId,
            "dateCreated": dateCreated,
            "createdBy": $scope.activity.createdBy || 'openk',
            "dateStarted": dateStarted,
            "dateFinished": dateFinished,
            "description": $scope.activity.settings.reason,
            "activePowerJpaToBeReduced": {
                "value": $scope.activity.settings.requiredReductionPower,
                "multiplier": "M",
                "unit": "W"
            },
            "reasonOfReduction": $scope.activity.settings.reasonOfReduction,
            "subGeographicalRegionJpaList": $scope.activity.settings.subGeographicalRegions,
            "substationJpaList": $scope.activity.settings.transformerStations,
            "practice": $scope.activity.settings.training,
            'geographicalRegion': $scope.activity.settings.useWholeArea,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": $scope.activity.preselection.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.preselection.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                "substituteValueWindFwt": $scope.activity.preselection.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.preselection.substituteValueBiogasFwt
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
            "timeout": 30000
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