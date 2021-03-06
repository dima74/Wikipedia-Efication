use itertools::Itertools;

pub fn is_russian_lower(c: char) -> bool {
    ('а' <= c && c <= 'я') || c == 'ё'
}

pub fn is_russian_upper(c: char) -> bool {
    ('А' <= c && c <= 'Я') || c == 'Ё'
}

pub fn is_russian(c: char) -> bool {
    is_russian_lower(c) || is_russian_upper(c)
}

pub fn is_russian_in_text(prev: char, curr: char, next: char) -> bool {
    is_russian(curr)
        || curr == '-' && is_russian(prev) && is_russian(next)
}

pub fn find_words(text: String) -> Vec<String> /* todo Vec<&str> */ {
    let mut words = Vec::new();

    let mut ok = false;
    let mut word = String::new();
    for (prev, curr, next) in text.chars().tuple_windows::<(_, _, _)>() {
        if word.is_empty() {
            if is_russian(curr) {
                ok = prev != '-' && /* исключение слов вида "[[год]]у" */ prev != ']';
                word.push(curr);
            }
        } else {
            if is_russian_in_text(prev, curr, next) {
                word.push(curr);
            } else {
                ok &= next != '-';
                if ok {
                    words.push(word.clone());
                }
                word.clear();
            }
        }
    }

    words
}
