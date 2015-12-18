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
app.controller('EditRegulationController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

    $rootScope.currentWizardStep = 'EditDownRegulation';

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'state1') {
            $rootScope.currentWizardStep = "EditDownRegulation";
            $scope.CanNavigateToEditSettings = false;
            $scope.CanNavigateToEditProposal = false;
            $scope.CanNavigateToEditProposalConfirmation = false;
            $rootScope.selectedTemplate = null;
        }
        if (toState.name === 'EditRegulation.EditDownRegulation') {
            $rootScope.currentWizardStep = "EditDownRegulation";
        }

        if (toState.name === 'EditRegulation.EditSettings') {
            $rootScope.currentWizardStep = "EditSettings";
            $scope.CanNavigateToEditSettings = true;
        }
        if (toState.name.indexOf('EditRegulation.EditProposal') === 0) {
            $rootScope.currentWizardStep = "EditProposal";
            $scope.CanNavigateToEditProposal = true;
        }
        if (toState.name === 'EditRegulation.EditProposalConfirmation') {
            $rootScope.currentWizardStep = "EditProposalConfirmation";
            $scope.CanNavigateToEditProposalConfirmation = true;
        }
    });
}]);
