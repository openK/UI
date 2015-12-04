app.factory('activityService', ['$http', '$q', '$log', function ($http, $q, $log) {

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

    var configData = {};

    function resetActivity() {
        configData = {};
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
    }
    ;

    /*
     Daten laden
     */
    function loadTaskConfiguration() {
        if (configData.task) {
            return $q.resolve(configData.task);
        }
        configData.task = {};
        return $q.all([
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/").then(function (result) {
                configData.task.templates = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reductionsettinglist/").then(function (result) {
                configData.task.regulationSteps = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                configData.task.regulationReasons = result.data;
            }),
             $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/timeintervaldataexpired").then(function (result) {
                 configData.task.timerTick = result.data;
             }),
        ]);
    }

    var newActivity = null;
    function createActivity() {
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/latestusersettings/' + currentParentActivityId).then(function (result) {
            newActivity = result.data;
        });
    }

    function loadActivityConfiguration() {
        if (configData.activity) {
            return $q.resolve(configData.activity);
        }
        configData.activity = {};
        return $q.all([
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                configData.activity.regulationReasons = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/lov/").then(function (result) {
                configData.activity.transformerStations = result.data;
                //if (activity.settings.transformerStations && configData.activity.transformerStations) {
                //    var tmpTicked = activity.settings.transformerStations;
                //    for (var i = 0; i < configData.activity.transformerStations.length; i++) {
                //        for (var j = 0; j < tmpTicked.length; j++) {
                //            if (configData.activity.transformerStations[i].mRid === tmpTicked[j].mRid) {
                //                configData.activity.transformerStations[i].ticked = true;
                //                break;
                //            }
                //        }
                //    }
                //}
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/lov/").then(function (result) {
                configData.activity.subGeographicalRegions = result.data;
                //if (activity.settings.subGeographicalRegions && configData.activity.subGeographicalRegions) {
                //    var tmpTicked = activity.settings.subGeographicalRegions;
                //    for (var i = 0; i < configData.activity.subGeographicalRegions.length; i++) {
                //        for (var j = 0; j < tmpTicked.length; j++) {
                //            if (configData.activity.subGeographicalRegions[i].mRid === tmpTicked[j].mRid) {
                //                configData.activity.subGeographicalRegions[i].ticked = true;
                //                break;
                //            }
                //        }
                //    }
                //}
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/hysteresis").then(function (result) {
                configData.activity.hysteresis = result.data;
            })
        ]);
    }
    var loadConfiguration = function () {
        return $q.all([loadTaskConfiguration(), loadActivityConfiguration()]);
    }
    var parentActivities;
    var pageSize = 5;
    var loadParentActivities = function (page, size, time, sortExpression, filterExpression) {
        var params = {
            page: page || 0,
            size: size || pageSize,
            t: time || new Date().getTime()
        };
        if (sortExpression) {
            params.sort = sortExpression;
        }

        if (filterExpression) {
            console.log(filterExpression);
            params.filter = filterExpression;
        }
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/findprocessoverviewlist", { "params": params }).success(function (data) {
            //$log.info("Success loading /openk-eisman-portlet/rest/findparentactivitylist");
            //$scope.overview.data = $filter('orderBy')(data.content, "id", true);
            parentActivities = data;
        }).error(function (data, status, headers, config) {
            $log.error('Cannot load /openk-eisman-portlet/rest/findprocessoverviewlist/');
        });
    };

    var currentParentActivityId;
    var currentParentActivity;
    return {
        pageSize: pageSize,
        resetActivity: resetActivity,
        activity: function(act) {
            if (act) {
                activity = act;
            }
            return activity;
        },
        activityConfigData: function() {
            return configData;
        },
        createActivity: createActivity,
        newActivity: function() {
            return newActivity;
        },
        loadParentActivities: loadParentActivities,
        loadConfiguration: loadConfiguration,
        loadTaskConfiguration: loadTaskConfiguration,
        loadActivityConfiguration: loadActivityConfiguration,
        currentParentActivityId: function (id) {
            if (id) {
                currentParentActivityId = id;
                parentActivities.content.forEach(function(activity) {
                    if (activity.id === id) {
                        currentParentActivity = activity;
                    }
                });
            }

            return currentParentActivityId;
        },
        getParentActivities: function () {
            return parentActivities;
        },
        currentParentActivity: function () {
            return currentParentActivity;
        }
    };

}]);