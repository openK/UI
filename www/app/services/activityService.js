app.factory('activityService', ['$http', '$q', function ($http, $q) {

    var activity = {
        dateCreated: null,
        id: null,
        preselection: {
            reductionSetting: '',
            discriminationCoefficientEnabled: "false",
            characteristicForMissingMeasurementJpaFwt: '',
            substituteValuePhotovoltaicFwt: null,
            substituteValueWindFwt: null,
            substituteValueBiogasFwt: null,
            characteristicForMissingMeasurementJpaEfr: '',
            substituteValuePhotovoltaicEfr: null,
            substituteValueWindEfr: null,
            substituteValueBiogasEfr: null
        },
        settings: {
            dateStarted: '',
            dateFinished: '',
            reasonOfReduction: '',
            requiredReductionPower: '',
            useWholeArea: false,
            subGeographicalRegions: {},
            transformerStations: {},
            description: '',
            practise: "false"
        },
        substationProposalList: []
    };

    var configData = '';

    function resetActivity() {
        configData = null;
        activity.dateCreated = null;
        activity.id = null;
        activity.preselection = {
            reductionSetting: '',
            discriminationCoefficientEnabled: "false",
            characteristicForMissingMeasurementJpaFwt: '',
            substituteValuePhotovoltaicFwt: null,
            substituteValueWindFwt: null,
            substituteValueBiogasFwt: null,
            characteristicForMissingMeasurementJpaEfr: '',
            substituteValuePhotovoltaicEfr: null,
            substituteValueWindEfr: null,
            substituteValueBiogasEfr: null
        };
        activity.settings = {
            dateStarted: '',
            dateFinished: '',
            reasonOfReduction: '',
            requiredReductionPower: '',
            useWholeArea: false,
            subGeographicalRegions: {},
            transformerStations: {},
            description: '',
            practise: "false"
        };
        activity.substationProposalList = [];
    };

    /*
     Daten laden
     */
    function loadActivityConfiguration() {
        if (configData) {
            return $q.resolve(configData);
        }
        configData = {};
        return $q.all([
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/").then(function (result) {
                configData.templates = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reductionsettinglist/").then(function (result) {
                configData.regulationSteps = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                configData.regulationReasons = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/lov/").then(function (result) {
                configData.transformerStations = result.data;
                if (activity.settings.transformerStations && configData.transformerStations) {
                    var tmpTicked = activity.settings.transformerStations;
                    for (var i = 0; i < configData.transformerStations.length; i++) {
                        for (var j = 0; j < tmpTicked.length; j++) {
                            if (configData.transformerStations[i].mRid === tmpTicked[j].mRid) {
                                configData.transformerStations[i].ticked = true;
                                break;
                            }
                        }
                    }
                }
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                activity.mailReasons = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/lov/").then(function (result) {
                configData.subGeographicalRegions = result.data;
                if (activity.settings.subGeographicalRegions && configData.subGeographicalRegions) {
                    var tmpTicked = activity.settings.subGeographicalRegions;
                    for (var i = 0; i < configData.subGeographicalRegions.length; i++) {
                        for (var j = 0; j < tmpTicked.length; j++) {
                            if (configData.subGeographicalRegions[i].mRid === tmpTicked[j].mRid) {
                                configData.subGeographicalRegions[i].ticked = true;
                                break;
                            }
                        }
                    }
                }
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/timeintervaldataexpired").then(function (result) {
                activity.timerTick = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/hysteresis").then(function (result) {
                activity.hysteresis = result.data;
            })
        ]);
    }

    return {
        resetActivity: resetActivity,
        activity: function() {
            return activity;
        },
        activityConfigData: function() {
            return configData;
        },
        loadActivityConfiguration: loadActivityConfiguration
    };

}]);