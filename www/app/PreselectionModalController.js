app.controller('PreselectionModalController', function ($scope, $rootScope, $modalInstance, $http, activityService) {

    $scope.saveOk = false;
    if ($rootScope.selectedTemplate && $rootScope.selectedTemplate.name) {
        $scope.templateName = $rootScope.selectedTemplate.name;
    }

    $scope.activity = activityService.activity();
    $scope.templates = activityService.activityConfigData().templates;
    $scope.cancel = function () {

        $modalInstance.dismiss('cancel');
    };

    $scope.close = function () {

        $modalInstance.close();
    };

    $scope.ok = function () {
        var templateData = {
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
            name: $scope.templateName
        };

        $rootScope.templates.forEach(function(template) {
            if (template.name === $scope.templateName) {
                templateData.id = template.id;
            }
        });

        if (templateData.id) {
            $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/" + templateData.id, templateData).then(function (result) {
                $scope.saveOk = true;
            });
        } else {
            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/", templateData).then(function (result) {
                $rootScope.templates.push(result.data);
                $rootScope.selectedTemplate = result.data;
                $scope.saveOk = true;
            });
        }
    };
});
