app.controller('PreselectionModalController', function ($scope, $rootScope, $modalInstance, $http, items) {

    $scope.templateName = '';
    $scope.items = items;
    $scope.saveOk = false;

    if (items && $scope.items[0]) {

        $scope.templateName = $scope.items[0].name;
    }

    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {

        $modalInstance.close();
    };

    $scope.ok = function () {
        alert('Test');

        var tmp = {
            preselectionConfigurationJpa: {
                reductionSetting: $scope.items[1].preselection.reductionSetting,
                discriminationCoefficientEnabled: $scope.items[1].preselection.discriminationCoefficientEnabled,
                characteristicForMissingMeasurementFwt: $scope.items[1].preselection.characteristicForMissingMeasurementFwt,
                substituteValuePhotovoltaicFwt: $scope.items[1].preselection.substituteValuePhotovoltaicFwt,
                substituteValueWindFwt: $scope.items[1].preselection.substituteValueWindFwt,
                substituteValueBiogasFwt: $scope.items[1].preselection.substituteValueBiogasFwt,
                provideInServiceDate: $scope.items[1].preselection.provideInServiceDate,

                characteristicForMissingMeasurementEfr: $scope.items[1].preselection.characteristicForMissingMeasurementEfr,
                substituteValuePhotovoltaicEfr: $scope.items[1].preselection.substituteValuePhotovoltaicEfr,
                substituteValueWindEfr: $scope.items[1].preselection.substituteValueWindEfr,
                substituteValueBiogasEfr: $scope.items[1].preselection.substituteValueBiogasEfr
            },
            id: '',
            name: ''
        };

        if ($scope.templateName && $scope.templateName !== '') {

            var exists = false;
            //var id;
            var preselectionArray = $scope.items[2];

            for (var i in preselectionArray) {

                if (preselectionArray[i] && preselectionArray[i].name === $scope.templateName) {

                    tmp.id = preselectionArray[i].id;
                    exists = true;
                }
            }

            if (exists) {

                tmp.name = $scope.templateName;
                //tmp.id = id;

                $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/" + tmp.id, tmp).success(function (data) {

                    $rootScope.$emit('resetPreselection', [true, data]);
                    //$scope.templateName = '';

                    $scope.saveOk = true;
                });

            } else {

                tmp.name = $scope.templateName;

                $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/", tmp).success(function (data) {

                    $rootScope.$emit('resetPreselection', [false, data]);
                    //$scope.templateName = '';

                    $scope.saveOk = true;
                });
            }

            //if ($scope.items[0] && $scope.items[0].name === $scope.templateName) {
            //
            //    tmp.name = $scope.templateName;
            //    tmp.id = $scope.items[0].id;
            //
            //    $http.put("/openk-eisman-portlet/rest/preselection/" + $scope.items[0].id, tmp).success(function (data) {
            //
            //        $rootScope.$emit('resetPreselection', [true, data]);
            //        $scope.templateName = '';
            //    });
            //
            //} else {
            //
            //    tmp.name = $scope.templateName;
            //
            //    $http.post("/openk-eisman-portlet/rest/preselection/", tmp).success(function (data) {
            //
            //        $rootScope.$emit('resetPreselection', [false, data]);
            //        $scope.templateName = '';
            //
            //        $scope.saveOk = true;
            //    });
            //}
        }

        // $modalInstance.close();
    };

    $scope.isNameInvalid = function () {

        if (!$scope.templateName || $scope.templateName === '') {

            return true;
        }

        return false;
    };
});
