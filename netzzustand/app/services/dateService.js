/********************************************************************************
 * Copyright (c) 2015 BTC AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Stefan Brockmann - initial API and implementation
 * Jan Krueger - initial API and implementation
 *******************************************************************************/

app.factory('dateService', ['$filter', '$translate', function ($filter, $translate) {

    var dateRegex = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/;
    //var dateRegexServer = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/;
    var dateRegexServer = /^(\d{4})\-(\d{2})\-(\d{4})T(\d{2}):(\d{2}):(\d{2})*$/;
    //2015-08-28T12:58:47.125+0200

    return {
        getDateFromString: function (dateArray) {
            var date;

            if (dateArray !== null) {
                var year = parseInt(dateArray[3], 10);
                var month = parseInt(dateArray[2], 10) - 1;
                var day = parseInt(dateArray[1], 10);
                var hour = parseInt(dateArray[4], 10);
                var minute = parseInt(dateArray[5], 10);
                //var second = parseInt(dateArray[6], 10);
                date = new Date(year, month, day, hour, minute);//, second);
            }

            return date;
        },

        getDateFromServerString: function (dateArray) {
            var date;

            if (dateArray !== null) {
                var year = parseInt(dateArray[1], 10);
                var month = parseInt(dateArray[2], 10);
                var day = parseInt(dateArray[3], 10);
                var hour = parseInt(dateArray[4], 10);
                var minute = parseInt(dateArray[5], 10);
                var second = parseInt(dateArray[6], 10);
                date = new Date(year, month, day, hour, minute, second);
            }

            return date;
        },

        isDateValid: function (dateString) {
            var isValid = true;

            var tmpDate = dateString.match(dateRegex);
            var date = this.getDateFromString(tmpDate);

            if (!date || date.getFullYear() !== parseInt(tmpDate[3], 10) ||
                date.getMonth() !== parseInt(tmpDate[2], 10) - 1 ||
                date.getDate() !== parseInt(tmpDate[1], 10) ||
                date.getHours() !== parseInt(tmpDate[4], 10) ||
                date.getMinutes() !== parseInt(tmpDate[5], 10)
            ) {
                isValid = false;
            }

            return isValid;
        },

        isActualDate: function (dateString) {

            var tmpDate = dateString.match(dateRegex);
            var date = this.getDateFromString(tmpDate);

            if (!date) {
                return false;
            }
            var timeA = date.getTime();
            var timeB = new Date().getTime();
            return date.getTime() >= new Date().getTime();
        },

        isDateBehind: function (dateStringFrom, dateStringTo) {

            var fromTmpDate = dateStringFrom.match(dateRegex);
            var toTmpDate = dateStringTo.match(dateRegex);

            var dateFrom = this.getDateFromString(fromTmpDate);
            var dateTo = this.getDateFromString(toTmpDate);

            return dateTo.getTime() > dateFrom.getTime();
        },

        formatDateForBackend: function (dateString) {
            var tmpDate = dateString.match(dateRegex);
            var date = this.getDateFromString(tmpDate);

            if (!date) {
                return false;
            }
            return $filter('date')(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
        },

        formatDateForRestRequest: function (dateString) {

            var dateStringForRestRequest = dateString.substring(0, 19);
            return dateStringForRestRequest + 'Z';
        },

        formateDateForClient: function (dateString) {

            if (!dateString) {
                return '';
            }
            return $filter('date')(new Date(dateString), 'short');
        },

        getDateDiff: function (dateString1, dateString2) {

            var date1 = new Date(this.getDateFromString(dateString1.match(dateRegex)));
            var date2 = new Date(this.getDateFromString(dateString2.match(dateRegex)));
            var diff = '-';

            if (date1 && date2) {
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                var diffHours = Math.floor((timeDiff - (diffDays * (1000 * 3600 * 24))) / (1000 * 3600));
                var diffMinutes = Math.floor((timeDiff - (diffDays * (1000 * 3600 * 24)) - (diffHours * (1000 * 3600))) / (1000 * 60));

                diff = diffDays + " " + $translate.instant('DAYS') + " " + diffHours + " " + $translate.instant('HOURS') + " " + diffMinutes + " " + $translate.instant('MINUTES');
            }

            return diff;
        }
    };
}]);