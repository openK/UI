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
app.controller('RegulationController', ['$scope', '$state', '$rootScope','$filter', 'modalService', function ($scope, $state, $rootScope, $filter, modalService) {

        $rootScope.preselectionFormInValid = false;
        $rootScope.settingsFormInValid = true;

        $rootScope.currentWizardStep = 'CreateDownRegulation';

        $scope.mytimer = false;
        $scope.showTimer = function () {

            return $scope.mytimer;
        };
        $scope.modalOptions = {
            "headline": $filter('translate')('NETSTATE.EXPIRED.HEADLINE'),
            "id": '',
            "bodyText": $filter('translate')('NETSTATE.EXPIRED.TEXTBODY'),
            "actionButtonText": $filter('translate')('NETSTATE.EXPIRED.CONFIRM'),
            "closeButtonText": $filter('translate')('NETSTATE.EXPIRED.DENY'),
            "close": function () {
                modalService.close();
            },
            "ok": function () {
                modalService.close();
                $state.go('state1', {show: 'Aktiv'});
            }
        };
        var timerCallback = function (event, data) {
            modalService.open($scope, 'app/partials/confirm.html');
        };
        $scope.$on('timer-stopped', timerCallback);

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
