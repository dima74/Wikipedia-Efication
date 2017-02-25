# Ёфикатор

[![Build Status](https://travis-ci.org/dima74/Wikipedia-Efication.svg?branch=master)](https://travis-ci.org/dima74/Wikipedia-Efication)

В этом репозитории находятся наработки, позволяющие [ёфицировать](https://ru.wikipedia.org/wiki/Ёфикатор) Википедию в полуавтоматическом режиме. Если вы нашли ошибку в работе ёфикатора, [создайте](https://github.com/dima74/Wikipedia-Efication/issues/new) issue. 

# Как начать ёфицировать
1. [Зарегистрируйтесь](https://ru.wikipedia.org/w/index.php?title=Служебная:Создать_учётную_запись) в Википедии.
2. Откройте страницу [common.js](https://ru.wikipedia.org/wiki/Служебная:Моя_страница/common.js).
3. Нажмите "Создать как викитекст".
4. Появится редактор, добавьте следующие строчки, затем нажмите "записать страницу".

        importScript('Участник:Дима74/eficator.js'); //linkback [[Участник:Дима74/eficator.js]]
    
5. Перейдите на страницу [Служебная:Ёфикация](https://ru.wikipedia.org/wiki/Служебная:Ёфикация).
6. Вас автоматически перенаправит на случайную страницу, чтобы вы её ёфицировали.
7. Когда страница загрузится, будет выполнена прокрутка до слова, которое предлагается ёфицировать. Слово будет выделено ярко-синим цветом.
8. Далее вам доступны две горячие клавиши:

        j   принять замену
        f   отменить замену

9. Проверьте, что замена корректна, и нажмите соответствующую клавишу.
10. После нажатия `j` или `f` будет найдено следующее слово для ёфикации, и страница будет прокручена до него. Если больше нет слов для ёфикации, будет произведена правка страницы от вашего имени (это может занять некоторое время), затем произойдёт перенаправление на следующую страницу для ёфикации.

# Продвинутое использование
* Если вы хотите ёфицировать какую-то конкретную статью, просто перейдите на неё и добавьте `?efication=true` в конец URL.
* Вам также доступна горячая клавиша `q`, которая отменяет все принятые замены и переходит к следующий статье.

# Как это работает
* Был скачен [дамп русской Википедии](https://dumps.wikimedia.org/backup-index.html).
* Для каждого слова, в котором есть ё, было посчитано число вхождений версии слова с ё и версии слова без ё.
* Были найдены все слова, чьи версии с ё встречались больше раз чем версии без ё.
* Во всех статьях Википедии были найдены вхождения версий таких слов без ё и для каждой статьи был создан список замен (находятся по адресу [Wikipedia-Efication-Replaces](https://github.com/dima74/Wikipedia-Efication-Replaces)).
* На javascript был написан скрипт, который при заходе на страницу `Служебная:Ёфикация` выбирает случайную статью для ёфикации, переходит на неё, показывает замены пользователю и на основе решения пользователя производит правку этой статьи.

# Как собрать проект
    git clone https://github.com/dima74/Wikipedia-Efication
    cd Wikipedia-Efication
    git submodule update --init --recursive
    ./scripts/all.sh

# Задачи
- [x] printPagesThatContains --- ignore case
- [x] Просмотреть страницы, содержащие {{nobots}}
- [x] getWordContext --- многострочный контекст
- [x] Разобраться с "Broken pipe"
- [x] Обрабатывать только текст статьи вне тегов и шаблонов:
  - [x] {{цитата|...}}
  - [x] {{начало цитаты}}...{{конец цитаты}}
  - [x] <nowiki>...</nowiki>
  - [x] [link ...]
  - [x] [[link|...]]
  - [ ] Вложенные теги
- [x] При отмене замены сохранять слово в файлик и больше не предлагать его заменять
- [x] Исправить обработку заголовков страниц, содержащих `&`
- [ ] Ёфикация в браузере
  - [ ] Добавить анимацию загрузки для длительных действий