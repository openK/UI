app.factory('activityService', ['$http', '$q', '$log', '$filter', 'modalServiceNew', '$state', function ($http, $q, $log, $filter, modalServiceNew, $state) {

    var createParentActivity = function () {
        return {
            id: null,
            dateCreated: null,
            createdBy: null,
            updatedBy: null,
            dateStarted: null,
            dateFinished: null,
            reductionValue: null,
            reasonOfReduction: null,
            dateDeactivated: null,
            deactivatedBy: null,
            description: null,
            pointOfInjectionType: null,
            processStatus: null,
            pointOfInjectionList: null,
            childActivityList: [{
                id: null,
                parentActivityJpaId: null,
                dateStarted: null,
                dateFinished: null,
                reductionSetting: 60,
                discriminationCoefficientEnabled: false,
                reasonOfReduction: null,
                requiredReductionPower: null,
                description: null,
                practise: false,
                seqNum: null,
                processStatus: null,
                characteristicForMissingMeasurementFwt: 'NotIncluded',
                substituteValuePhotovoltaicFwt: null,
                substituteValueWindFwt: null,
                substituteValueBiogasFwt: null,
                characteristicForMissingMeasurementEfr: 'NotIncluded',
                substituteValuePhotovoltaicEfr: null,
                substituteValueWindEfr: null,
                substituteValueBiogasEfr: null,
                useWholeArea: true,
                subGeographicalRegions: null,
                transformerStations: null,
                substationProposalList: null
            }],
        };
    };

    var createChildActivity = function () {
        return {
            id: null,
            parentActivityJpaId: null,
            dateStarted: null,
            dateFinished: null,
            reductionSetting: 60,
            reductionValue: null,
            discriminationCoefficientEnabled: false,
            reasonOfReduction: null,
            requiredReductionPower: null,
            description: null,
            practise: false,
            processStatus: null,
            characteristicForMissingMeasurementFwt: 'NotIncluded',
            substituteValuePhotovoltaicFwt: null,
            substituteValueWindFwt: null,
            substituteValueBiogasFwt: null,
            characteristicForMissingMeasurementEfr: 'NotIncluded',
            substituteValuePhotovoltaicEfr: null,
            substituteValueWindEfr: null,
            substituteValueBiogasEfr: null,
            useWholeArea: true,
            pointOfInjectionType: null,
            pointOfInjectionList: null,
            subGeographicalRegions: null,
            transformerStations: null,
            substationProposalList: null
        };
    };

    var resetActivity = function () {
        childActivity = createChildActivity();
    }

    var currentParentActivityId;
    var currentParentActivity = createParentActivity();
    var childActivity = createChildActivity();
    var configData = {};

    function loadActivity() {
        if (!currentParentActivityId) {
            return $q.when();
        }
        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/latestusersettings/' + currentParentActivityId).then(function (result) {
            childActivity = result.data;
            angular.extend(childActivity, childActivity.preselectionConfigurationDto);
            delete childActivity.preselectionConfigurationDto;
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', { show: 'Aktiv' });
            });
        });
    }

    function loadConfiguration() {
        configData.activity = {};
        configData.task = {};
        return $q.all([
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reasonofreductions/").then(function (result) {
                configData.regulationReasons = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/substation/lov/").then(function (result) {
                result.data = result.data.sort(function (a, b) { if (a.name < b.name) return -1; else return 1; });
                configData.transformerStations = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/subgeographicalregion/lov/").then(function (result) {
                configData.subGeographicalRegions = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/hysteresis").then(function (result) {
                configData.hysteresis = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/preselection/").then(function (result) {
                configData.templates = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/reductionsettinglist/").then(function (result) {
                configData.regulationSteps = result.data;
            }),
            $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/timeintervaldataexpired").then(function (result) {
                configData.timerTick = result.data;
            })
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

        params.sort = params.sort.replace("dateStarted", "userSettingsJpa.dateStarted");
        params.sort = params.sort.replace("dateFinished", "userSettingsJpa.dateFinished");
        params.sort = params.sort.replace("reasonOfReduction", "userSettingsJpa.reasonOfReduction");
        params.sort = params.sort.replace("practise", "userSettingsJpa.practise");
        params.sort = params.sort.replace("reductionValue", "activePowerJpaToBeReduced.value");

        console.log('filter:' + params.filter);

        show = show || 'Aktiv';

        return $http.get(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/findprocessoverviewlist", { "params": params }).then(function (result) {
            parentActivities = result.data;
            parentActivities.content.forEach(function (parent) {
                parent.childActivityList = [];
                parent.actionOverviewDtoList.forEach(function (child) {
                    parent.childActivityList.push(angular.extend({}, child));
                });
                delete parent.actionOverviewDtoList;
            });

            return parentActivities;
        }, function (error) {
            modalServiceNew.showErrorDialog(error).then(function () {
                $state.go('state1', { show: 'Aktiv' });
            });
            $log.error('Cannot load /openk-eisman-portlet/rest/findprocessoverviewlist/');
        });
    };


    return {
        pageSize: pageSize,
        createParentActivity: createParentActivity,
        createChildActivity: createChildActivity,
        resetActivity: resetActivity,
        childActivity: function (act) {
            if (act) {
                childActivity = act;
            }
            return childActivity;
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