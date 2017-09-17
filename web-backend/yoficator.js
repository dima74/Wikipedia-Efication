/*
 * Скрипт-Ёфикатор для Википедии
 * Инструкция по использованию находится по адресу https://ru.wikipedia.org/wiki/Участник:Дима74/Скрипт-Ёфикатор
 * Историю изменений можно найти на гитхабе: https://github.com/dima74/Wikipedia-Yofication/commits/master
 */

$(function () {
    // вы можете переопределить эти переменные, написав перед подключением скрипта что-то вроде
    // var Eficator_MinReplaceFrequency = <число от нуля до ста, чем меньше, тем больше правок будет предлагаться, но некоторые из них придётся отменять>
    var addPortletLinkAction = typeof Eficator_AddPortletLinkAction === 'undefined' ? true : Eficator_AddPortletLinkAction;
    var editSummary = typeof Eficator_EditSummary === 'undefined' ? 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]' : Eficator_EditSummary;
    var minReplaceFrequency = typeof Eficator_MinReplaceFrequency === 'undefined' ? 60 : Eficator_MinReplaceFrequency;

    var MESSAGE_NO_REPLACES = 'Эта страница и так уже ёфицирована. \n(Не найдено замен для этой страницы)';
    var replacesURL = 'https://yofication.diraria.ru/cache';
    var generateURL = 'https://yofication.diraria.ru/generate';

    // импорт через
    // mw.loader.load('https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js', 'text/javascript');
    // не всегда работает
    /**
     * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
     * Licensed under MIT
     * @author Ariel Flesler
     * @version 2.1.2
     */
    //@formatter:off
    (function(f){"use strict";"function"===typeof define&&define.amd?define(["jquery"],f):"undefined"!==typeof module&&module.exports?module.exports=f(require("jquery")):f(jQuery)})(function($){"use strict";function n(a){return!a.nodeName||-1!==$.inArray(a.nodeName.toLowerCase(),["iframe","#document","html","body"])}function h(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}var p=$.scrollTo=function(a,d,b){return $(window).scrollTo(a,d,b)};p.defaults={axis:"xy",duration:0,limit:!0};$.fn.scrollTo=function(a,d,b){"object"=== typeof d&&(b=d,d=0);"function"===typeof b&&(b={onAfter:b});"max"===a&&(a=9E9);b=$.extend({},p.defaults,b);d=d||b.duration;var u=b.queue&&1<b.axis.length;u&&(d/=2);b.offset=h(b.offset);b.over=h(b.over);return this.each(function(){function k(a){var k=$.extend({},b,{queue:!0,duration:d,complete:a&&function(){a.call(q,e,b)}});r.animate(f,k)}if(null!==a){var l=n(this),q=l?this.contentWindow||window:this,r=$(q),e=a,f={},t;switch(typeof e){case "number":case "string":if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(e)){e= h(e);break}e=l?$(e):$(e,q);case "object":if(e.length===0)return;if(e.is||e.style)t=(e=$(e)).offset()}var v=$.isFunction(b.offset)&&b.offset(q,e)||b.offset;$.each(b.axis.split(""),function(a,c){var d="x"===c?"Left":"Top",m=d.toLowerCase(),g="scroll"+d,h=r[g](),n=p.max(q,c);t?(f[g]=t[m]+(l?0:h-r.offset()[m]),b.margin&&(f[g]-=parseInt(e.css("margin"+d),10)||0,f[g]-=parseInt(e.css("border"+d+"Width"),10)||0),f[g]+=v[m]||0,b.over[m]&&(f[g]+=e["x"===c?"width":"height"]()*b.over[m])):(d=e[m],f[g]=d.slice&& "%"===d.slice(-1)?parseFloat(d)/100*n:d);b.limit&&/^\d+$/.test(f[g])&&(f[g]=0>=f[g]?0:Math.min(f[g],n));!a&&1<b.axis.length&&(h===f[g]?f={}:u&&(k(b.onAfterFirst),f={}))});k(b.onAfter)}})};p.max=function(a,d){var b="x"===d?"Width":"Height",h="scroll"+b;if(!n(a))return a[h]-$(a)[b.toLowerCase()]();var b="client"+b,k=a.ownerDocument||a.document,l=k.documentElement,k=k.body;return Math.max(l[h],k[h])-Math.min(l[b],k[b])};$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(a){return $(a.elem)[a.prop]()}, set:function(a){var d=this.get(a);if(a.options.interrupt&&a._last&&a._last!==d)return $(a.elem).stop();var b=Math.round(a.now);d!==b&&($(a.elem)[a.prop](b),a._last=this.get(a))}};return p});
    //@formatter:on

    var currentPageTitle = mw.config.get('wgTitle');
    if (mw.config.get('wgPageName') === 'Служебная:Ёфикация') {
        showStatus('Возможность непрерывной ёфикации в настоящий момент недоступна.\nДля подробностей смотрите конец [[Википедия:К_удалению/29_мая_2017#.D0.A3.D1.87.D0.B0.D1.81.D1.82.D0.BD.D0.B8.D0.BA:.D0.94.D0.B8.D0.BC.D0.B074.2F.D0.A1.D0.BA.D1.80.D0.B8.D0.BF.D1.82-.D0.81.D1.84.D0.B8.D0.BA.D0.B0.D1.82.D0.BE.D1.80|этого обсуждения]].');
    } else if (window.location.search.indexOf('yofication=true') !== -1) {
        performYofication();
    } else if (addPortletLinkAction && mw.config.get('wgNamespaceNumber') === 0) {
        mw.util.addPortletLink('p-cactions', '/wiki/' + mw.config.get('wgPageName') + '?yofication=true', 'Ёфицировать', 'ca-eficator', ' Ёфицировать страницу');
    }

    function customizeToolbarYoficateButton() {
        $('#wpTextbox1').wikiEditor('addToToolbar', {
            'section': 'main',
            'group': 'insert',
            'tools': {
                'indent': {
                    filters: ['body.ns-0'],
                    label: 'Ёфицировать',
                    type: 'button',
                    icon: 'http://localhost:7777/yo.png',
                    action: {
                        type: 'callback',
                        execute: function () {
                            performYofication(false);
                        }
                    }
                }
            }
        });
    }

    /* Check if view is in edit mode and that the required modules are available. Then, customize the toolbar … */
    if ($.inArray(mw.config.get('wgAction'), ['edit', 'submit']) !== -1) {
        mw.loader.using('user.options').then(function () {
            // This can be the string "0" if the user disabled the preference ([[phab:T54542#555387]])
            if (mw.user.options.get('usebetatoolbar') === 1) {
                $.when(
                    mw.loader.using('ext.wikiEditor.toolbar'), $.ready
                ).then(customizeToolbarYoficateButton);
            }
        });
    }

    function showStatus(status, error) {
        console.log(status);
        var snackbar = $('#eficator-snackbar');
        if (snackbar.length === 0) {
            $('body').append('<div id="eficator-snackbar" style="min-width: 250px; transform: translateX(-50%); background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 1; left: 50%; bottom: 30px;">Спасибо, что воспользовались ёфикатором!</div>');
            snackbar = $('#eficator-snackbar');
        }
        if (typeof error !== 'undefined' && error) {
            status += '\nПожалуйста, попробуйте обновить страницу. \nЕсли это не поможет, свяжитесь с [[Участник:Дима74|автором скрипта]].';
        }
        status = status.replace(/\n/g, '<br />');
        status = status.replace(/\[\[([^|]*)\|([^\]]*)]]/g, '<a href="/wiki/$1" style="color: #0ff;">$2</a>');
        snackbar.html(status);
    }

    function scrollToReplace() {
        var replace = $('#yofication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }

    function exit(message, error) {
        if (typeof(message) === 'string') {
            showStatus(message, typeof error === 'undefined' ? true : error);
        } else {
            message = '';
        }
        throw message;
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    String.prototype.insert = function (i, s, numberCharsToReplace) {
        return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
    };

    String.prototype.getIndexesOf = function (s) {
        var indexes = [];
        var start = 0;
        var position;
        while ((position = this.indexOf(s, start)) !== -1) {
            indexes.push(position);
            start = position + s.length;
        }
        return indexes;
    };

    String.prototype.deyofication = function () {
        return this.replace('ё', 'е');
    };

    String.prototype.isRussianLetterInWord = function () {
        return this.length === 1 && this.match(/[а-яА-ЯёЁ\-\u00AD\u0301]/);
    };

    function performYofication(continuousYofication) {
        function generateReplaces(errorMessage) {
            $.ajax({
                url: generateURL + '/' + currentPageTitle + '?minReplaceFrequency=' + minReplaceFrequency,
                dataType: 'json',
                error: function () {
                    showStatus(errorMessage);
                },
                success: getReplacesCallbackCreator(false)
            });
        }

        function getReplacesCallbackCreator(allowGenerate) {
            return function ReplacesCallback(object) {
                var currentRevision = mw.config.get('wgCurRevisionId');
                if (currentRevision !== object.revision) {
                    if (!allowGenerate) {
                        exit('Непредвиденная ошибка', 'Пожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].');
                    }
                    replacesGenerated = true;
                    showStatus('Генерируем замены...');
                    generateReplaces('Произошла ошибка при генерации замен');
                    return;
                }

                var textDiv = $('#mw-content-text');
                var text = textDiv.html();
                var replaces = object.replaces;
                replaces = replaces.filter(function (replace) { return replace.frequency >= minReplaceFrequency * 100; });
                if (replaces.length === 0) {
                    showStatus(MESSAGE_NO_REPLACES);
                    removeArgumentsFromUrl();
                    return;
                }
                replaces.forEach(function (replace) { replace.isAccept = false; });
                var iReplace = -1;
                var done = false;
                goToNextReplace();
                $(window).on('resize', scrollToReplace);

                function goToNextReplace() {
                    while (!goToReplace(++iReplace)) {}
                }

                function goToPreviousReplace() {
                    --iReplace;
                    while (iReplace >= 0 && !goToReplace(iReplace)) {
                        --iReplace;
                    }
                    if (iReplace < 0) {
                        iReplace = 0;
                        throw 'goToPreviousReplace: iReplace < 0';
                    }
                    replaces[iReplace].isAccept = false;
                }

                function makeChange(callback) {
                    done = true;
                    var replacesRight = replaces.filter(function (replace) { return replace.isAccept; });
                    if (replacesRight.length === 0) {
                        callback();
                        return;
                    }
                    showStatus('Делаем правку: \nЗагружаем викитекст страницы...');
                    getWikiText(function (wikitext) {
                        showStatus('Делаем правку: \nПрименяем замены...');
                        var replaceSomething = false;
                        for (var i = 0; i < replacesRight.length; ++i) {
                            var replace = replacesRight[i];
                            var eword = replace.eword;
                            if (wikitext.substr(replace.indexWordStart, eword.length) !== eword.deyofication()) {
                                exit('Ошибка: викитекст страницы "' + currentPageTitle + '" не совпадает в индексе ' + replace.indexWordStart
                                    + '\nПожалуйста, сообщите название этой страницы [[Участник:Дима74|автору скрипта]].'
                                    + '\nожидается: "' + eword.deyofication() + '"'
                                    + '\nполучено: "' + wikitext.substr(replace.indexWordStart, eword.length) + '"', false);
                                return;
                            }
                            wikitext = wikitext.insert(replace.indexWordStart, eword, eword.length);
                            replaceSomething = true;
                        }

                        if (replaceSomething) {
                            showStatus('Делаем правку: \nОтправляем изменения...');
                            editPage({
                                title: currentPageTitle,
                                text: wikitext,
                                summary: editSummary
                            }, callback);
                        }
                    });
                }

                function removeArgumentsFromUrl() {
                    window.history.pushState('', '', window.location.href.replace('?yofication=true', ''));
                }

                function goToReplace(iReplace) {
                    if (iReplace === replaces.length) {
                        textDiv.html(text);
                        makeChange(continuousYofication ? goToNextPage : removeArgumentsFromUrl);
                        return true;
                    }
                    if (iReplace > replaces.length) {
                        throw 'goToReplace: iReplace > replaces.length';
                    }

                    var replace = replaces[iReplace];
                    var eword = replace.eword;
                    var status = 'Замена ' + (iReplace + 1) + ' из ' + replaces.length + '\n' + eword + '\nЧастота: ' + replace.frequency + '%';
                    showStatus(status);
                    var indexes = text.getIndexesOf(eword.deyofication());

                    // игнорируем вхождения dword внутри слов
                    indexes = indexes.filter(function (i) {
                        var j = i + eword.length;
                        return (i === 0 || !text[i - 1].isRussianLetterInWord()) && (j === text.length || !text[j].isRussianLetterInWord());
                    });

                    // выделяем цветом
                    if (indexes.length !== replace.numberSameDwords) {
                        showStatus(status + '\nПредупреждение: не совпадает numberSameDwords\nНайдено: ' + indexes.length + '\nДолжно быть: ' + replace.numberSameDwords + ' \n(индексы найденных: ' + indexes + ')');
                        return false;
                    }
                    var indexWordStart = indexes[replace.numberSameDwordsBefore];
                    var textNew = text.insert(indexWordStart, '<span style="background: cyan;" id="yofication-replace">' + eword + '</span>', eword.length);
                    textDiv.html(textNew);

                    // проверяем на видимость
                    if (!$('#yofication-replace').is(':visible')) {
                        console.log('Предупреждение: замена не видна');
                        return false;
                    }

                    // скроллим
                    scrollToReplace();
                    return true;
                }

                function acceptReplace() {
                    replaces[iReplace].isAccept = true;
                    goToNextReplace();
                }

                function rejectReplace() {
                    goToNextReplace();
                }

                function showCurrentReplaceAgain() {
                    scrollToReplace();
                }

                var actions = {
                    'j': acceptReplace,
                    'о': acceptReplace,
                    'f': rejectReplace,
                    'а': rejectReplace,
                    // ещё раз показать последнюю замену
                    ';': showCurrentReplaceAgain,
                    'ж': showCurrentReplaceAgain,
                    // вернуться к предыдущей замене
                    'a': goToPreviousReplace,
                    'ф': goToPreviousReplace
                };

                $(document).keypress(function (event) {
                    if (!done && event.key in actions) {
                        actions[event.key]();
                    }
                });
            };
        }

        showStatus('Загружаем список замен...');
        $.ajax({
            url: replacesURL + '/replacesByTitles/' + currentPageTitle,
            dataType: 'json',
            error: function () {
                showStatus('В последнем дампе Википедии не нашлось замен для этой страницы \nПроверяем, появились ли замены с того времени...');
                generateReplaces(MESSAGE_NO_REPLACES);
            },
            success: getReplacesCallbackCreator(true)
        });
    }

    function getWikiText(callback) {
        (new mw.Api()).get({
            prop: 'revisions',
            rvprop: 'content',
            rvlimit: 1,
            indexpageids: true,
            titles: currentPageTitle
        }).done(function (data) {
            var query = data.query;
            callback(query.pages[query.pageids[0]].revisions[0]['*']);
        }).fail(function () {
            showStatus('Не получилось получить викитекст страницы', true);
        });
    }

    function editPage(info, callback) {
        $.ajax({
            url: mw.util.wikiScript('api'),
            type: 'POST',
            dataType: 'json',
            data: {
                format: 'json',
                action: 'edit',
                title: currentPageTitle,
                minor: true,
                text: info.text,
                summary: info.summary,
                token: mw.user.tokens.get('editToken')
            },
            error: function () {
                showStatus('Не удалось произвести правку', true);
            },
            success: function (data) {
                if (!data.edit || data.edit.result !== 'Success') {
                    console.log(data);
                    showStatus('Не удалось произвести правку: ' + data.edit.info, true);
                    return;
                }
                showStatus('Правка выполена');
                callback();
            }
        });
    }
});