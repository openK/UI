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
