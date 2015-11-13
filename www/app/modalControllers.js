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

app.controller('ProposalModalController', function ($scope, $rootScope, $modalInstance, $http, $filter, items) {

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

app.controller('RecalculateModalController', function ($scope, $rootScope, $modalInstance, $http, items) {

    $scope.items = items;

    $scope.reCalc = function () {

        $scope.$root.$broadcast('requireRecalculate', [true]);
        $modalInstance.close();
    };

    $scope.use = function () {

        $modalInstance.dismiss('cancel');
    };
});

app.controller('DisplayErrorController', function ($scope, $rootScope, $modalInstance, $http, items) {

    $scope.items = items;

    $scope.ok = function () {

        $modalInstance.dismiss('cancel');
    };
});

app.controller('PreselectionModalController', function ($scope, $rootScope, $modalInstance, $http, items) {

    $scope.templateName = '';
    $scope.items = items;
    $scope.saveOk = false;

    if (items && $scope.items[0]) {

        $scope.templateName = $scope.items[0].name;
    }

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {

        $modalInstance.close();
    };

    $scope.ok = function () {

        var tmp = {
            preselectionConfigurationJpa: {
                reductionSetting: $scope.items[1].preselection.reductionSetting,
                discriminationCoefficientEnabled: $scope.items[1].preselection.discriminationCoefficientEnabled,
                characteristicForMissingMeasurementFwt: $scope.items[1].preselection.characteristicForMissingMeasurementFwt,
                substituteValuePhotovoltaicFwt: $scope.items[1].preselection.substituteValuePhotovoltaicFwt,
                substituteValueWindFwt: $scope.items[1].preselection.substituteValueWindFwt,
                substituteValueBiogasFwt: $scope.items[1].preselection.substituteValueBiogasFwt,
                provideInServiceDate: $scope.items[1].preselection.provideInServiceDate,

                characteristicForMissingMeasurementEfr: $scope.items[1].preselection.characteristicForMissingMeasurementEfr,
                substituteValuePhotovoltaicEfr: $scope.items[1].preselection.substituteValuePhotovoltaicEfr,
                substituteValueWindEfr: $scope.items[1].preselection.substituteValueWindEfr,
                substituteValueBiogasEfr: $scope.items[1].preselection.substituteValueBiogasEfr
            },
            id: '',
            name: ''
        };

        if ($scope.templateName && $scope.templateName !== '') {

            var exists = false;
            //var id;
            var preselectionArray = $scope.items[2];

            for (var i in preselectionArray) {

                if (preselectionArray[i] && preselectionArray[i].name === $scope.templateName) {

                    tmp.id = preselectionArray[i].id;
                    exists = true;
                }
            }

            if (exists) {

                tmp.name = $scope.templateName;
                //tmp.id = id;

                $http.put("/openk-eisman-portlet/rest/preselection/" + tmp.id, tmp).success(function (data) {

                    $rootScope.$emit('resetPreselection', [true, data]);
                    //$scope.templateName = '';

                    $scope.saveOk = true;
                });

            } else {

                tmp.name = $scope.templateName;

                $http.post("/openk-eisman-portlet/rest/preselection/", tmp).success(function (data) {

                    $rootScope.$emit('resetPreselection', [false, data]);
                    //$scope.templateName = '';

                    $scope.saveOk = true;
                });
            }

            //if ($scope.items[0] && $scope.items[0].name === $scope.templateName) {
            //
            //    tmp.name = $scope.templateName;
            //    tmp.id = $scope.items[0].id;
            //
            //    $http.put("/openk-eisman-portlet/rest/preselection/" + $scope.items[0].id, tmp).success(function (data) {
            //
            //        $rootScope.$emit('resetPreselection', [true, data]);
            //        $scope.templateName = '';
            //    });
            //
            //} else {
            //
            //    tmp.name = $scope.templateName;
            //
            //    $http.post("/openk-eisman-portlet/rest/preselection/", tmp).success(function (data) {
            //
            //        $rootScope.$emit('resetPreselection', [false, data]);
            //        $scope.templateName = '';
            //
            //        $scope.saveOk = true;
            //    });
            //}
        }

        // $modalInstance.close();
    };

    $scope.isNameInvalid = function () {

        if (!$scope.templateName || $scope.templateName === '') {

            return true;
        }

        return false;
    };
});

