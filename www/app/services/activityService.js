app.factory('activityService', ['$http', '$q', '$log', '$filter', function ($http, $q, $log, $filter) {

    var activity = {
        dateCreated: null,
        id: null,
        preselection: {
            reductionSetting: '',
            discriminationCoefficientEnabled: false,
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
            useWholeArea: true,
            subGeographicalRegions: {},
            transformerStations: {},
            description: '',
            practise: false
        },
        substationProposalList: []
    };

    var configData = {};

    function resetActivity() {
        configData = {};
        activity.dateCreated = null;
        activity.id = null;
        activity.preselection = {
            reductionSetting: 60,
            discriminationCoefficientEnabled: false,
            characteristicForMissingMeasurementFwt: 'NotIncluded',
            substituteValuePhotovoltaicFwt: null,
            substituteValueWindFwt: null,
            substituteValueBiogasFwt: null,
            characteristicForMissingMeasurementEfr: 'NotIncluded',
            substituteValuePhotovoltaicEfr: null,
            substituteValueWindEfr: null,
            substituteValueBiogasEfr: null
        };
        activity.settings = {
            dateStarted: '',
            dateFinished: '',
            reasonOfReduction: '',
            requiredReductionPower: '',
            useWholeArea: true,
            subGeographicalRegions: {},
            transformerStations: {},
            description: '',
            practise: false
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
        return $q.all([ $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/").then(function (result) {
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

    function createActivity() {
        return activity;
    }

    function loadActivity() {
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/latestusersettings/' + currentParentActivityId).then(function (result) {
            activity = result.data;
        });
    }

    function loadChildActivity() {
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/latestusersettings/' + activity.id).then(function (result) {
            var id = activity.id;
            activity = result.data;
            activity.id = id;
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
    var defaultSortExpression = 'id,desc';
    var loadParentActivities = function (page, size, time, sortExpression, filterExpression, show) {
        var params = {
            page: page || 0,
            size: size || pageSize,
            t: time || new Date().getTime()
        };

        params.sort = sortExpression || defaultSortExpression;

        params.filter = filterExpression || {};

        if (show === 'Deleted') {
            params.filter.isDeleted = "true";
        } else {
            params.filter.isDeleted = "false";
        }
        if (show === 'Terminated') {
            params.filter.isTerminated = "true";
        } else {
            params.filter.isTerminated = "false";
        }

        console.log('filter:' + params.filter);

        show = show || 'Aktiv';

        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/findprocessoverviewlist", { "params": params }).then(function (result) {
            //$log.info("Success loading /openk-eisman-portlet/rest/findparentactivitylist");
            parentActivities = result.data;
            //parentActivities.content = $filter('filter')(result.data.content, function (value, index, array) {
            //    if (show === 'Beendet') {
            //        if (value.processStatus === "Terminated") {
            //            return true;
            //        } else {
            //            return false;
            //        }
            //    }
            //    if (show === 'Aktiv') {
            //        if (value.processStatus === "Live" || value.processStatus === "WithoutSchedule" || value.processStatus === "Pending") {
            //            return true;
            //        } else {
            //            return false;
            //        }
            //    }
            //    if (show === 'Deleted') {
            //        return true;
            //    }
            //});
            return parentActivities;
        }, function (error) {
            $log.error('Cannot load /openk-eisman-portlet/rest/findprocessoverviewlist/');
        });
    };

    var currentParentActivityId;
    var currentParentActivity;
    return {
        pageSize: pageSize,
        resetActivity: resetActivity,
        activity: function (act) {
            if (act) {
                activity = act;
            }
            return activity;
        },
        activityConfigData: function () {
            return configData;
        },
        createActivity: createActivity,
        loadActivity: loadActivity,
        loadChildActivity: loadChildActivity,
        loadParentActivities: loadParentActivities,
        loadConfiguration: loadConfiguration,
        loadTaskConfiguration: loadTaskConfiguration,
        loadActivityConfiguration: loadActivityConfiguration,
        currentParentActivityId: function (id) {
            if (id) {
                currentParentActivityId = id;
                parentActivities.content.forEach(function (activity) {
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