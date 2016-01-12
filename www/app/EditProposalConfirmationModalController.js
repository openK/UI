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

    $scope.activity = activityService.childActivity();
    var hysteresis = activityService.activityConfigData().hysteresis || 5;

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
    //var red = $scope.activity.settings.requiredReductionPower * hysteresis / 100;
    var red = $scope.activity.reductionValue * hysteresis / 100; // Bug-Fix: $scope.activity.settings.requiredReductionPower ist null
    
    
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
                "reductionSetting": $scope.activity.reductionSetting,
                "discriminationCoefficientEnabled": $scope.activity.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": $scope.activity.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": $scope.activity.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": $scope.activity.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": $scope.activity.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": $scope.activity.substituteValueBiogasFwt,
                'substituteValueWindEfr': $scope.activity.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': $scope.activity.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': $scope.activity.substituteValueBiogasEfr
            },
            'synchronousMachineJpaReducedList': $scope.activity.substationProposalList,
        };

        //$http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", postData).success(function (data) {

            $state.go('EditRegulation.EditProposalConfirmation');

        //}).error(function (data, status, headers, config) {

        //    $scope.$broadcast('displayError', ['Es gab einen Fehler bei der Datenabfrage.']);
        //    $log.error('Can not load /openk-eisman-portlet/rest/activity/');

        //});

        $modalInstance.close();
    };
}]);