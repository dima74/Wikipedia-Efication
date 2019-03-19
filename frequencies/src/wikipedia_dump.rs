use std::error::Error;
use std::io::{BufRead, BufReader};

use bzip2::read::BzDecoder;

const WIKIPEDIA_DUMP_URL: &str = "https://dumps.wikimedia.org/ruwiki/latest/ruwiki-latest-pages-articles.xml.bz2";

const TITLE_START: &str = "    <title>";
const TITLE_END: &str = "</title>";
const NAMESPACE_START: &str = "    <ns>";
const NAMESPACE_END: &str = "</ns>";
const TEXT_START: &str = "      <text xml:space=\"preserve\">";
const TEXT_END: &str = "</text>";

pub fn iterate_articles<T: FnMut(String, String) -> ()>(mut consumer: T, mut number_articles: u32) -> Result<(), Box<dyn Error>> {
    let response = reqwest::get(WIKIPEDIA_DUMP_URL)?;
    let decompressor = BzDecoder::new(response);
    let reader = BufReader::new(decompressor);

    let mut title = None;
    let mut namespace = None;
    let mut iterator = reader.lines();
    while number_articles != 0 {
        let line = iterator.next();
        if line.is_none() { return Ok(()); }
        let line = line.unwrap()?;

        if line.starts_with(TITLE_START) {
            let start = TITLE_START.len();
            let end = line.len() - TITLE_END.len();
            title = Some(line[start..end].to_string());
        }

        if line.starts_with(NAMESPACE_START) {
            let start = NAMESPACE_START.len();
            let end = line.len() - NAMESPACE_END.len();
            namespace = Some(line[start..end].to_string());
        }

        if line.starts_with(TEXT_START) {
            let mut text = line[TEXT_START.len()..].to_string();
            while !text.ends_with(TEXT_END) {
                let line = iterator.next();
                if line.is_none() { return Ok(()); }
                let line = line.unwrap()?;

                text.push('\n');
                text += &line;
            }
            text.truncate(text.len() - TEXT_END.len());

            if title.is_none() || namespace.is_none() {
                panic!("Перед <text> не было встречено <title> или <namespace>");
            }

            let title = title.take().unwrap();
            let namespace = namespace.take().unwrap();
            if namespace != "0" { continue; }

            consumer(title, text);
            number_articles -= 1;
        }
    }

    Ok(())
}