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

app.filter('booleanFilter', ['$filter', function ($filter) {
    return function (value) {
        var val = $filter('translate')('NO');

        if (value) {
            val = $filter('translate')('YES');
        }
        return val;
    };
}]);

app.filter('editFilter', ['$filter', function ($filter) {
    return function (value) {

        var val = $filter('translate')('NO');

        if (value) {
            val = $filter('translate')('YES');
        }
        return val;
    };
}]);

app.filter('showFilter', ['dateService', function (dateService) {

    function addZero(digit) {
        return (digit < 10) ? ('0' + digit) : '' + digit;
    }

    return function (value) {

        var now = new Date();
        var then = new Date(value.dateStarted);

        var time = addZero(now.getDate()) + '.' + addZero(now.getMonth() + 1) + '.' + now.getFullYear() + ' ' + addZero(now.getHours()) + ':' + addZero(now.getMinutes()) + ':' + addZero(now.getSeconds());
        var thenTime = addZero(then.getDate()) + '.' + addZero(then.getMonth() + 1) + '.' + then.getFullYear() + ' ' + addZero(then.getHours()) + ':' + addZero(then.getMinutes()) + ':' + addZero(then.getSeconds());

        return dateService.isDateBehind(time, thenTime) ? '' : 'display:none;';
    };
}]);

app.filter('datex', function (i18nService) {

    return function (value) {
        if (!value)
            return null;

        var lang = i18nService.getCurrentLang();
        var datetime = value.toString().split('T');
        var date = datetime[0].split('-');
        var time = datetime[1].split(':');
        var patterns = {};
        patterns.de = 'dd.mm.YYYY hh:MM';
        patterns.en = 'YYYY-mm-dd hh:MM';
        patterns.fr = 'dd.mm.YYYY hh:MM';
        return patterns[lang].replace(/YYYY/, date[0]).replace(/mm/, date[1]).replace(/dd/, date[2]).replace(/hh/, time[0]).replace(/MM/, time[1]);

    }


});

app.filter('decision', function () {

    return function (value) {
        var lang = {};
        lang.de = ['Ja', ' Nein'];
        lang.en = ['Yes', ' No'];

        if (value) {
            return lang['de'][0];
        } else {
            return lang['de'][1];
        }
    }
});

app.filter('status', function () {

    return function (value) {
        
        var now =  new Date();
        var startdate = new Date(value[0]);
        var enddate = new Date(value[1]);
        
        if(now.getTime() >= startdate.getTime() && now.getTime() <= enddate.getTime()){
            return 'STATE.ACTIVE';
        }
        else{
            if(now.getTime() >= enddate.getTime()){
                return 'STATE.FINISHED';
            }
            else{
                return 'STATE.PENDING';
            }
        }
        
        
        return value[0];
    };
});

app.filter('kv', function () {

    var kvdata = ['0,4','10','20','30','60','110','220','380'];
    return function (value) {
        
            return kvdata[value];
    }
});

app.filter('decimalger', function () {

    
    return function (value) {
        
            return value.toString().replace(/\./,',');
    }
});






