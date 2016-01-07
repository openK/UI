app.factory('activityService', ['$http', '$q', '$log', '$filter', 'modalServiceNew', '$state', function ($http, $q, $log, $filter, modalServiceNew, $state) {

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

    function loadActivity() {
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/latestusersettings/' + currentParentActivityId).then(function (result) {
            activity = result.data;
        }, function (error) {
            modalService.showErrorDialog(error);
        });
    }

    function loadConfiguration() {
        configData.activity = {};
        configData.task = {};
        return $q.all([
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                configData.activity.regulationReasons = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/lov/").then(function (result) {
                configData.activity.transformerStations = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/lov/").then(function (result) {
                configData.activity.subGeographicalRegions = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/hysteresis").then(function (result) {
                configData.activity.hysteresis = result.data;
            }),
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
            parentActivities = result.data;
            return parentActivities;
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', { show: 'Aktiv' });
            });
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
        loadActivity: loadActivity,
        loadParentActivities: loadParentActivities,
        loadConfiguration: loadConfiguration,
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