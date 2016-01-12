app.controller('PreselectionModalController', function ($scope, $rootScope, $modalInstance, $http, activityService) {

    $scope.saveOk = false;
    $scope.closeButtonText = "Abbrechen";

    if ($rootScope.selectedTemplate && $rootScope.selectedTemplate.name) {
        $scope.templateName = $rootScope.selectedTemplate.name;
    }

    $scope.activity = activityService.childActivity();
    $scope.templates = activityService.activityConfigData().templates;

    $scope.close = function () {
        if ($scope.closeButtonText === "Abbrechen") {
            $modalInstance.dismiss('cancel');
        } else {
            $scope.closeButtonText = "Abbrechen";
            $modalInstance.close();
        }
    };

    $scope.ok = function () {
        var templateData = {
            preselectionConfigurationJpa: {
                reductionSetting: $scope.activity.reductionSetting,
                discriminationCoefficientEnabled: $scope.activity.discriminationCoefficientEnabled,
                characteristicForMissingMeasurementFwt: $scope.activity.characteristicForMissingMeasurementFwt,
                substituteValuePhotovoltaicFwt: $scope.activity.substituteValuePhotovoltaicFwt,
                substituteValueWindFwt: $scope.activity.substituteValueWindFwt,
                substituteValueBiogasFwt: $scope.activity.substituteValueBiogasFwt,
                provideInServiceDate: $scope.activity.provideInServiceDate,

                characteristicForMissingMeasurementEfr: $scope.activity.characteristicForMissingMeasurementEfr,
                substituteValuePhotovoltaicEfr: $scope.activity.substituteValuePhotovoltaicEfr,
                substituteValueWindEfr: $scope.activity.substituteValueWindEfr,
                substituteValueBiogasEfr: $scope.activity.substituteValueBiogasEfr
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
                $scope.closeButtonText = "Schließen";
            });
        } else {
            $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/", templateData).then(function (result) {
                $rootScope.templates.push(result.data);
                $rootScope.selectedTemplate = result.data;
                $scope.saveOk = true;
                $scope.closeButtonText = "Schließen";
            });
        }
    };
});
