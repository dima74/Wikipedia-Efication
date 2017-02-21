$(function () {
    mw.loader.load('https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.js');
    if (typeof($.scrollTo) === 'undefined') {
        exit('Ошибка: $.scrollTo не определено');
        return;
    }

    var currentPageTitle = mw.config.get('wgTitle');
    if (mw.config.get('wgPageName') == 'Служебная:Ёфикация') {
        goToNextPage();
    }
    else if (window.location.search.indexOf('efication=true') != -1) {
        performEfication();
    }
    $(window).on('resize', scrollToReplace);

    function scrollToReplace() {
        var replace = $('#efication-replace');
        if (replace.length) {
            $.scrollTo(replace, {over: 0.5, offset: -$(window).height() / 2});
        }
    }

    function exit(message) {
        if (typeof(message) === 'string') {
            console.log(message);
            alert(message);
        }
        throw '';
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function goToNextPage() {
        function errorGoToNextPage() {
            alert('Не удалось получить следующую страницу');
        }

        console.log('Переходим к следующей странице...');
        $.ajax({
            url: "https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/numberPages",
            error: errorGoToNextPage,
            success: function (data) {
                console.log('\tЗагрузили число страниц для ёфикации');
                var i = getRandomInt(0, Number(data));
                $.ajax({
                    url: "https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/pagesToEfication/" + i,
                    error: errorGoToNextPage,
                    success: function (pageTitle) {
                        console.log('\tЗагрузили название статьи для ёфикации');
                        window.location.href = 'https://ru.wikipedia.org/wiki/' + pageTitle + '?efication=true';
                    }
                });
            }
        });
    }

    String.prototype.insert = function (i, s, numberCharsToReplace) {
        return this.substr(0, i) + s + this.substr(i + numberCharsToReplace);
    };

    String.prototype.getIndexesOf = function (s) {
        var indexes = [];
        var start = 0;
        var position;
        while ((position = this.indexOf(s, start)) != -1) {
            indexes.push(position);
            start = position + s.length;
        }
        return indexes;
    };

    String.prototype.deefication = function () {
        return this.replace('ё', 'е');
    };

    function performEfication() {
        console.log('Загружаем список замен...');
        $.ajax({
            url: 'https://raw.githubusercontent.com/dima74/Wikipedia-Efication-Replaces/master/replacesByTitles/' + currentPageTitle,
            dataType: 'json',
            error: function () {
                alert('Не найдено замен для этой страницы');
            },
            success: function (object) {
                var currentRevision = mw.config.get('wgCurRevisionId');
                if (currentRevision != object.revision) {
                    console.log('Пропускается "' + currentPageTitle + '", так как появилась новая версия');
                    goToNextPage();
                    return;
                }

                var textDiv = $('#mw-content-text');
                var text = textDiv.html();
                var replaces = object.replaces;
                var iReplace = -1;
                var replacesRight = [];
                console.log('Всего замен: ' + replaces.length);
                goToNextReplace();

                function goToNextReplace() {
                    while (!goToReplace(++iReplace)) {}
                }

                function makeChange(callback) {
                    if (replacesRight.length === 0) {
                        callback();
                        return;
                    }
                    console.log('Делаем правку...');
                    getWikiText(function (wikitext) {
                        for (var i = 0; i < replacesRight.length; ++i) {
                            var replace = replacesRight[i];
                            var ewordContext = replace.eword;
                            var eword = ewordContext.substr(1, ewordContext.length - 1);
                            if (wikitext.substr(replace.indexWordStart, eword.length) != eword.deefication()) {
                                console.log('Ошибка: wikitext "' + currentPageTitle + '" не совпадает в индексе ' + replace.indexWordStart);
                                continue;
                            }
                            wikitext = wikitext.insert(replace.indexWordStart, eword, eword.length);
                        }

                        editPage({
                            title: currentPageTitle,
                            text: wikitext,
                            summary: 'Ёфикация с помощью [[Участник:Дима74/Скрипт-Ёфикатор|скрипта-ёфикатора]]'
                        }, callback);
                    });
                }

                function goToReplace(iReplace) {
                    if (iReplace == replaces.length) {
                        console.log('Все замены произведены');
                        // makeChange(goToNextPage);
                        // makeChange(function () {});
                        return true;
                    }
                    if (iReplace > replaces.length) {
                        throw '';
                    }

                    // выделяем цветом
                    var replace = replaces[iReplace];
                    var ewordContext = replace.eword;
                    var eword = ewordContext.substr(1, ewordContext.length - 2);
                    console.log(replace.frequency + ' ' + eword);
                    var indexes = text.getIndexesOf(ewordContext.deefication());
                    if (indexes.length != replace.numberSameDwords) {
                        console.log('Ошибка: не совпадает numberSameDwords, найдено ' + indexes.length + ', должно быть ' + replace.numberSameDwords + ' (индексы найденных: ' + indexes + ')');
                        return false;
                    }
                    var indexWordStart = indexes[replace.numberSameDwordsBefore] + 1;
                    var textNew = text.insert(indexWordStart, '<span style="background: cyan;" id="efication-replace">' + eword + '</span>', eword.length);
                    textDiv.html(textNew);

                    // проверяем на видимость
                    if (!$('#efication-replace').is(':visible')) {
                        console.log('Предупреждение: замена не видна');
                        return false;
                    }

                    // скроллим
                    scrollToReplace();
                    return true;
                }

                function acceptReplace() {
                    replacesRight.push(replaces[iReplace]);
                    goToNextReplace();
                }

                function rejectReplace() {
                    goToNextReplace();
                }

                var actions = {
                    'j': acceptReplace,
                    'f': rejectReplace,
                    'q': goToNextPage,
                    // ещё раз показать последнюю замену
                    ';': function () { goToReplace(iReplace); },
                    'n': function () { makeChange(goToNextPage); }
                };

                $(document).keypress(function (event) {
                    if (event.key in actions) {
                        actions[event.key]();
                    }
                });
            }
        });
    }

    function getWikiText(callback) {
        console.log('\tЗагружаем викитекст страницы');
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
            alert('Не получилось получить wikitext страницы');
        });
    }

    function editPage(info, callback) {
        console.log('\tОтправляем изменения');
        $.ajax({
            url: mw.util.wikiScript('api'),
            type: 'POST',
            dataType: 'json',
            data: {
                format: 'json',
                action: 'edit',
                title: info.title,
                text: info.text,
                summary: info.summary,
                token: mw.user.tokens.get('editToken')
            },
            error: function () {
                alert('Не удалось произвести правку');
            },
            success: function (data) {
                if (data.edit.result != 'Success') {
                    alert('Не удалось произвести правку: ' + data.edit.result);
                    return;
                }
                console.log('\tПравка выполена');
                callback();
            }
        });
    }
});