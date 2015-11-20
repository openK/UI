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

app.controller('RegulationController', ['$scope', '$stage', '$rootScope', function ($scope, $state, $rootScope) {
    $scope.IsDownRegulationActive = true;
    $scope.SetActive = function () {
        if ($scope.IsNetworkStateActive) {
            $state.go($rootScope.previousState.name);
            $scope.IsDownRegulationActive = true;
            $scope.IsNetworkStateActive = false;
        } else {
            $scope.IsDownRegulationActive = false;
            $scope.IsNetworkStateActive = true;
        }
    };
    
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.previousState = fromState;
    });
}]);
