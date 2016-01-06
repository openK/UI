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
app.controller('RegulationController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {

    $rootScope.preselectionFormInValid = false;
    $rootScope.settingsFormInValid = true;

    $rootScope.currentWizardStep = 'CreateDownRegulation';

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

        if (toState.name === 'state1') {
            $rootScope.currentWizardStep = "CreateDownRegulation";
            $rootScope.CanNavigateToCreateSettings = false;
            $rootScope.CanNavigateToCreateProposal = false;
            $rootScope.CanNavigateToCreateProposalConfirmation = false;
            $rootScope.selectedTemplate = null;
        }
        if (toState.name === 'Regulation.CreateDownRegulation') {
            $rootScope.currentWizardStep = "CreateDownRegulation";
        }
        if (toState.name === 'Regulation.CreateSettings') {
            $rootScope.currentWizardStep = "CreateSettings";
            $rootScope.CanNavigateToCreateSettings = true;
        }
        if (toState.name.indexOf('Regulation.CreateProposal') === 0) {
            $rootScope.currentWizardStep = "CreateProposal";
            $rootScope.CanNavigateToCreateProposal = true;
        }
        if (toState.name === 'Regulation.CreateProposalConfirmation') {
            $rootScope.currentWizardStep = "CreateProposalConfirmation";
            $rootScope.CanNavigateToCreateProposalConfirmation = true;
        }
    });
}]);
