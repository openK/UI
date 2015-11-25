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

app.controller('ChangeRegulationController', ['$scope', '$state', '$rootScope', 'activityService', function ($scope, $state, $rootScope, activityService) {
    $rootScope.parentActivityId = activityService.currentParentActivityId();
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
    });
    $scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
        console.log(unfoundState.to); 
        console.log(unfoundState.toParams); 
        console.log(unfoundState.options);
    });
}]);
