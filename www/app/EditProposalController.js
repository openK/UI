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
app.controller('EditProposalController', ['$scope', '$http', '$timeout', '$translate', 'uiGridConstants', '$log', '$rootScope', 'activityService', '$modal', function ($scope, $http, $timeout, $translate, uiGridConstants, $log, $rootScope, activityService, $modal) {

        $scope.$parent.mytimer = true;
        $scope.$parent.$broadcast('timer-start');
        $scope.activity = activityService.childActivity();
        $scope.openModalConfirmProposal = function () {
            $modal.open({
                animation: true,
                templateUrl: templPath + 'EditProposalConfirmationModal.html',
                controller: 'EditProposalConfirmationModalController',
                resolve: {
                    items: function () {
                        return [$scope.activity];
                    }
                }
            });
        };
    }]);