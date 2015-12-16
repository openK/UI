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

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'ChangeRegulation.ChangeSettings') {
            $scope.CanNavigateToChangeSettings = true;
        }
        if (toState.name.indexOf('ChangeRegulation.ChangeProposal') === 0) {
            $scope.CanNavigateToChangeProposal = true;
        }
        if (toState.name === 'ChangeRegulation.ChangeProposalConfirmation') {
            $scope.CanNavigateToChangeProposalConfirmation = true;
        }
    });

}]);
