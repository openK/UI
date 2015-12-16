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
    $scope.$on('$stateSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === 'Regulation.CreateSettings') {
            $scope.CanNavigateToSettings = true;
        }
        if (toState.name.indexOf('Regulation.CreateProposal') === 0) {
            $scope.CanNavigateToProposal = true;
        }
        if (toState.name === 'Regulation.CreateProposalConfirmation') {
            $scope.CanNavigateToProposalConfirmation = true;
        }
    });
}]);
