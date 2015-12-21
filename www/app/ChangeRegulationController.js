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
app.controller('ChangeRegulationController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

    $rootScope.currentWizardStep = 'ChangeDownRegulation';

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'state1') {
            $rootScope.currentWizardStep = "ChangeDownRegulation";
            $scope.CanNavigateToChangeSettings = false;
            $scope.CanNavigateToChangeProposal = false;
            $scope.CanNavigateToChangeProposalConfirmation = false;
            $rootScope.selectedTemplate = null;
        }
        if (toState.name === 'ChangeRegulation.ChangeDownRegulation') {
            $rootScope.currentWizardStep = "ChangeDownRegulation";
        }
        if (toState.name === 'ChangeRegulation.ChangeSettings') {
            $rootScope.currentWizardStep = "ChangeSettings";
            $scope.CanNavigateToChangeSettings = true;
        }
        if (toState.name.indexOf('ChangeRegulation.ChangeProposal') === 0) {
            $rootScope.currentWizardStep = "ChangeProposal";
            $scope.CanNavigateToChangeProposal = true;
        }
        if (toState.name === 'ChangeRegulation.ChangeProposalConfirmation') {
            $rootScope.currentWizardStep = "ChangeProposalConfirmation";
            $scope.CanNavigateToChangeProposalConfirmation = true;
        }
    });

}]);
