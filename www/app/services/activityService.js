app.factory('activityService', ['$http', '$q', '$log', '$filter', 'modalServiceNew', '$state', 'dateService', function ($http, $q, $log, $filter, modalServiceNew, $state, dateService) {

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

    var saveWithoutRegulation = function (activity) {
        var dateStarted = dateService.formatDateForBackend(activity.dateStarted);
        var dateFinished = dateService.formatDateForBackend(activity.dateFinished);
        var dateCreated = activity.dateCreated || $filter('date')(new Date($.now()), 'yyyy-MM-ddTHH:mm:ss.sssZ');
        var data = {
            "dateCreated": dateCreated,
            "createdBy": activity.createdBy,
            "id": activity.id,
            "parentActivityJpaId": activity.parentActivityJpaId,
            "userSettingsJpa": {
                "dateStarted": dateStarted,
                "dateFinished": dateFinished,
                "geographicalRegion": activity.useWholeArea,
                "reasonOfReduction": activity.reasonOfReduction,
                "practise": activity.practise,
                "description": activity.description
            },
            "activePowerJpaToBeReduced": {
                "value": activity.reductionValue,
                "multiplier": "M",
                "unit": "W"
            },
            "subGeographicalRegionJpaList": activity.subGeographicalRegions,
            "substationJpaList": activity.transformerStations,
            "preselectionName": "",
            "preselectionConfigurationJpa": {
                "reductionSetting": activity.reductionSetting,
                "discriminationCoefficientEnabled": activity.discriminationCoefficientEnabled,
                "characteristicForMissingMeasurementFwt": activity.characteristicForMissingMeasurementFwt,
                "characteristicForMissingMeasurementEfr": activity.characteristicForMissingMeasurementEfr,
                "substituteValueWindFwt": activity.substituteValueWindFwt,
                "substituteValuePhotovoltaicFwt": activity.substituteValuePhotovoltaicFwt,
                "substituteValueBiogasFwt": activity.substituteValueBiogasFwt,
                'substituteValueWindEfr': activity.substituteValueWindEfr,
                'substituteValuePhotovoltaicEfr': activity.substituteValuePhotovoltaicEfr,
                'substituteValueBiogasEfr': activity.substituteValueBiogasEfr
            },
            'synchronousMachineJpaReducedList': activity.substationProposalList,
        };

        if (data.parentActivityJpaId && data.id) {
            return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", data);
        } else {
            return $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/", data);
        }
    };

    var _mode;
    var mode = function (m) {
        if(m) {
            _mode = m;
        }
        return _mode;
    };

    var calculateReductionAdvice = function () {
        var url = Liferay.ThemeDisplay.getCDNBaseURL() + '/openk-eisman-portlet/rest/activity/createreductionadvice';

        if (mode() == 'add') {
            var data = {
                "id": null,
                "parentActivityJpaId": childActivity.parentActivityJpaId,
                "dateStarted": childActivity.dateStarted,
                "dateFinished": childActivity.dateFinished,
                "reductionValue": childActivity.reductionValue,
                "reasonOfReduction": childActivity.reasonOfReduction,
                "practise": childActivity.practise,
                "pointOfInjectionType": childActivity.pointOfInjectionType,
                "pointOfInjectionList": childActivity.pointOfInjectionList,
                "description": childActivity.description,
                "subGeographicalRegionJpaList": childActivity.subGeographicalRegions,
                "substationJpaList": childActivity.transformerStations,
                "preselectionConfigurationDto": {
                    "reductionSetting": childActivity.reductionSetting,
                    "discriminationCoefficientEnabled": childActivity.discriminationCoefficientEnabled,
                    "characteristicForMissingMeasurementFwt": childActivity.characteristicForMissingMeasurementFwt,
                    "characteristicForMissingMeasurementEfr": childActivity.characteristicForMissingMeasurementEfr,
                    "substituteValueWindFwt": childActivity.substituteValueWindFwt,
                    "substituteValuePhotovoltaicFwt": childActivity.substituteValuePhotovoltaicFwt,
                    "substituteValueBiogasFwt": childActivity.substituteValueBiogasFwt,
                    'substituteValueWindEfr': childActivity.substituteValueWindEfr,
                    'substituteValuePhotovoltaicEfr': childActivity.substituteValuePhotovoltaicEfr,
                    'substituteValueBiogasEfr': childActivity.substituteValueBiogasEfr
                }
            };

            url += 'foraction'

        } else {
            var data = {
                "id": childActivity.id,
                "parentActivityJpaId": childActivity.parentActivityJpaId,
                "userSettingsJpa": {
                    "dateStarted": childActivity.dateStarted,
                    "dateFinished": childActivity.dateFinished,
                    "geographicalRegion": childActivity.useWholeArea,
                    "reasonOfReduction": childActivity.reasonOfReduction,
                    "practise": childActivity.practise,
                    "description": childActivity.description
                },
                "activePowerJpaToBeReduced": {
                    "value": childActivity.reductionValue,
                    "multiplier": "M",
                    "unit": "W"
                },
                "subGeographicalRegionJpaList": childActivity.subGeographicalRegions,
                "substationJpaList": childActivity.transformerStations,
                "preselectionName": "",
                "preselectionConfigurationJpa": {
                    "reductionSetting": childActivity.reductionSetting,
                    "discriminationCoefficientEnabled": childActivity.discriminationCoefficientEnabled,
                    "characteristicForMissingMeasurementFwt": childActivity.characteristicForMissingMeasurementFwt,
                    "characteristicForMissingMeasurementEfr": childActivity.characteristicForMissingMeasurementEfr,
                    "substituteValueWindFwt": childActivity.substituteValueWindFwt,
                    "substituteValuePhotovoltaicFwt": childActivity.substituteValuePhotovoltaicFwt,
                    "substituteValueBiogasFwt": childActivity.substituteValueBiogasFwt,
                    'substituteValueWindEfr': childActivity.substituteValueWindEfr,
                    'substituteValuePhotovoltaicEfr': childActivity.substituteValuePhotovoltaicEfr,
                    'substituteValueBiogasEfr': childActivity.substituteValueBiogasEfr
                },
            };
        }
        return $http.post(url, data).then(function (result) {
            var advice = result.data.synchronousMachineJpaReducedList;
            if (result.data.id && result.data.parentActivityJpaId) {
                childActivity.id = result.data.id;
                childActivity.parentActivityJpaId = result.data.parentActivityJpaId;
                childActivity.activePowerJpaToBeReduced = { value: result.data.activePowerJpaToBeReduced.value };
                childActivity.substationProposalList = result.data.synchronousMachineJpaReducedList;

            } else {
                result.data.id = childActivity.id;
                result.data.parentActivityJpaId = childActivity.parentActivityJpaId;
                childActivity.substationProposalList = result.data.synchronousMachineJpaReducedList;
            }
            advice.forEach(function (value) {
                value.getCalculatedPower = parseInt(value.generatorPowerMeasured.value - (value.reductionAdvice / 100 * value.generatingUnitJpa.maxOperatingP.value));
            });

            childActivity.calculatedReductionAdvice = result.data;
            childActivity.calculatedReductionAdvice.dateStarted = childActivity.dateStarted;
            childActivity.calculatedReductionAdvice.dateFinished = childActivity.dateFinished;
            return $q.when(result);
        }, function (error) {
            return $q.reject(error);
        });
    }

    var saveActivity = function () {
        if (mode() === 'edit') {
            return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/confirmactivity/", childActivity.calculatedReductionAdvice);
        } else {
            childActivity.calculatedReductionAdvice.id = null;
            return $http.post(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/confirmactivity/", childActivity.calculatedReductionAdvice);
        }
    };
    var deleteProcess = function (parentId) {
        return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/deleteprocess", parentId);
    };

    var changeDateFinished = function (parentId, endDate) {
        return $http.put(Liferay.ThemeDisplay.getCDNBaseURL() + "/openk-eisman-portlet/rest/activity/modifydatefinished/" + parentId, endDate);
    };

    var stopProcess = function (parentId) {
        var endDate = '"' + $filter('date')(new Date($.now() + 10000), 'yyyy-MM-ddTHH:mm:ss.sssZ') + '"';
        return changeDateFinished(parentId, endDate);
    }

    return {
        pageSize: pageSize,
        createParentActivity: createParentActivity,
        createChildActivity: createChildActivity,
        resetActivity: resetActivity,
        saveWithoutRegulation: saveWithoutRegulation,
        calculateReductionAdvice: calculateReductionAdvice,
        saveActivity: saveActivity,
        loadActivity: loadActivity,
        loadParentActivities: loadParentActivities,
        loadConfiguration: loadConfiguration,
        deleteProcess: deleteProcess,
        changeDateFinished: changeDateFinished,
        stopProcess: stopProcess,
        mode: mode,
        childActivity: function (act) {
            if (act) {
                childActivity = act;
            }
            return childActivity;
        },

        activityConfigData: function () {
            return configData;
        },
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