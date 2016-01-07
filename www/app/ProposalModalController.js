/********************************************************************************
 * Copyright (c) 2015 BTC AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Stefan Brockmann - initial API and implementation
 * Jan Krueger - initial API and implementation XXX
 *******************************************************************************/

app.controller('ProposalModalController', function ($scope, $rootScope, $modalInstance, $filter, items) {

    $scope.items = items;

    if (items && $scope.items[0]) {

        $scope.activity = $scope.items[0];
    }

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

        $rootScope.$broadcast('gotoConfirm', [true]);
        $modalInstance.close();
    };
});

