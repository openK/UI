app.controller('PreselectionModalController', function ($scope, $rootScope, $modalInstance, $http, activityService) {

    $scope.templateName = '';
    $scope.saveOk = false;
    $scope.templateName = $rootScope.selectedTemplate.name;

    $scope.activity = activityService.activity();
    $scope.templates = activityService.activityConfigData().templates;
    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {

        $modalInstance.close();
    };

    $scope.ok = function () {
        var tmp = {
            preselectionConfigurationJpa: {
                reductionSetting: $scope.activity.preselection.reductionSetting,
                discriminationCoefficientEnabled: $scope.activity.preselection.discriminationCoefficientEnabled,
                characteristicForMissingMeasurementFwt: $scope.activity.preselection.characteristicForMissingMeasurementFwt,
                substituteValuePhotovoltaicFwt: $scope.activity.preselection.substituteValuePhotovoltaicFwt,
                substituteValueWindFwt: $scope.activity.preselection.substituteValueWindFwt,
                substituteValueBiogasFwt: $scope.activity.preselection.substituteValueBiogasFwt,
                provideInServiceDate: $scope.activity.preselection.provideInServiceDate,

                characteristicForMissingMeasurementEfr: $scope.activity.preselection.characteristicForMissingMeasurementEfr,
                substituteValuePhotovoltaicEfr: $scope.activity.preselection.substituteValuePhotovoltaicEfr,
                substituteValueWindEfr: $scope.activity.preselection.substituteValueWindEfr,
                substituteValueBiogasEfr: $scope.activity.preselection.substituteValueBiogasEfr
            },
            id: '',
            name: ''
        };

        $scope.templateName = $scope.templateName.trim();
        if ($scope.templateName) {

            var exists = false;
            //var id;

            for (var i in $scope.templates) {

                if ($scope.templates[i] && $scope.templates[i].name === $scope.templateName) {

                    tmp.id = $scope.templates[i].id;
                    exists = true;
                }
            }

            if (exists) {
                tmp.name = $scope.templateName;
                $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/" + tmp.id, tmp).then(function (result) {
                    var index;
                    $scope.templates.forEach(function (template, i) {
                        if (template.name === result.data.name) {
                            index = i;
                        }
                    });
                    activityService.activityConfigData().templates[index] = result.data;
                    $scope.templates[index] = result.data;
                    $rootScope.selectedTemplate = result.data;
                    $scope.saveOk = true;
                });

            } else {
                tmp.name = $scope.templateName;
                $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/", tmp).then(function (result) {
                    var index;
                    $scope.templates.forEach(function (template, i) {
                        if (template.name === result.data.name) {
                            index = i;
                        }
                    });
                    activityService.activityConfigData().templates[index] = result.data;
                    $scope.templates[index] = result.data;
                    $rootScope.selectedTemplate = result.data;
                    $scope.saveOk = true;
                });
            }
        }
    };

    $scope.isNameInvalid = function () {

        if (!$scope.templateName || $scope.templateName === '') {

            return true;
        }

        return false;
    };
});
