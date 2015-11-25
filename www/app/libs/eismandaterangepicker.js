/********************************************************************************
 * Copyright (c) 2015 BTC AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 * Jan Krueger - initial API and implementation
 *******************************************************************************/

$(document).ready(function () {

// todo: CQ ist noch nicht genehmigt: https://dev.eclipse.org/ipzilla/show_bug.cgi?id=9493
// todo: translation? hier evtl. eine AngularJs Directive erstellen

    var now = new Date();
    now.setHours(now.getHours());
    var minutes = now.getMinutes();
    var interval = 15;
    now.setMinutes(Math.round(minutes/interval) * interval);

    $('#datestarted').daterangepicker({
        singleDatePicker: true,
        timePicker12Hour: false,
        timePicker: true,
        timePickerIncrement: 15,
        startDate: now,
        minDate: new Date(),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

    $('#datefinished').daterangepicker({
        singleDatePicker: true,
        timePicker12Hour: false,
        timePicker: true,
        timePickerIncrement: 15,
        startDate: now,
        minDate: new Date(),
        locale: {
            format: 'DD.MM.YYYY HH:mm',
            applyLabel: '&Uuml;bernehmen',
            daysOfWeek: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            monthNames: ['Januar', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            firstDay: 1
        }
    });

});
