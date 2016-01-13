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
app.controller('ChangeProposalConfirmationModalController', ['$scope', '$state', '$rootScope', '$modalInstance', '$http', '$filter', 'activityService', 'dateService', '$log', function ($scope, $state, $rootScope, $modalInstance, $http, $filter, activityService, dateService, $log) {
    $scope.activity = activityService.childActivity();
    var hysteresis = activityService.activityConfigData().hysteresis || 5;

    $scope.enough = "";
    $scope.activity.proposal = {};
    $scope.activity.proposal.modal = {};
    $scope.activity.proposal.modal.sumRequiredReductionPower = 0;
    $scope.activity.proposal.modal.diffReductionPower = 0;
    $scope.activity.proposal.modal.requiredReductionPower = 0;
    $scope.activity.proposal.modal.requiredReductionPower = $filter('number')($scope.activity.reductionValue, 2);

    $scope.activity.dateCreated = $scope.activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
    $scope.dateStarted = $filter('date')(new Date($scope.activity.dateStarted), 'dd.MM.yyyy HH:mm');
    if ($scope.dateStarted.toString() === 'Invalid Date') {
        $scope.dateStarted = $scope.activity.dateStarted;
    }
    $scope.dateFinished = $filter('date')(new Date($scope.activity.dateFinished), 'dd.MM.yyyy HH:mm');
    if ($scope.dateFinished.toString() === 'Invalid Date') {
        $scope.dateFinished = $scope.activity.dateFinished;
    }
    $scope.dateCreated = $filter('date')(new Date($scope.activity.dateCreated), 'dd.MM.yyyy HH:mm');

    var red = $scope.activity.reductionValue * hysteresis / 100;

    $scope.activity.substationProposalList.forEach(function (value, key) {
        $scope.activity.proposal.modal.sumRequiredReductionPower += parseFloat(value.activePowerJpaToBeReduced.value);
    });
    $scope.activity.proposal.modal.sumRequiredReductionPower = $filter('number')($scope.activity.proposal.modal.sumRequiredReductionPower, 2);
    var a = parseFloat($scope.activity.proposal.modal.sumRequiredReductionPower);
    var b = parseFloat($scope.activity.proposal.modal.requiredReductionPower);
    $scope.activity.proposal.modal.diffReductionPower = a - b;
    $scope.activity.proposal.modal.diffReductionPower = $filter('number')($scope.activity.proposal.modal.diffReductionPower, 2);

    if (parseFloat($scope.activity.proposal.modal.diffReductionPower) < 0 || Math.abs(parseFloat($scope.activity.proposal.modal.diffReductionPower)) > red) {
        $scope.enough = "red";
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $state.go('ChangeRegulation.ChangeProposalConfirmation');
        $modalInstance.close();
    };
}]);