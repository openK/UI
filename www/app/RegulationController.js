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
    $rootScope.previousState = {};
    $rootScope.goToRegulationState = function () {
        if ($rootScope.currentState.name === 'Regulation.NetworkState.Main') {
            $state.go($rootScope.previousState.name);
        } else {
            $state.go($rootScope.currentState.name);
        }
    };
    
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState = fromState;
        $rootScope.currentState = toState;
        if (toState.name === 'Regulation.CreateSettings') {
            $rootScope.CanNavigateToCreateSettings = true;
        }
        if (toState.name === 'Regulation.CreateProposal') {
            $rootScope.CanNavigateToCreateProposal = true;
        }
        if (toState.name === 'Regulation.CreateProposalConfirmation') {
            $rootScope.CanNavigateToCreateProposalConfirmation = true;
        }
    });
    $scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        console.log(unfoundState.to); 
        console.log(unfoundState.toParams); 
        console.log(unfoundState.options);
    });
}]);
