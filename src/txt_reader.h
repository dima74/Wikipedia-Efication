#ifndef PARSE_TXT_READER_H
#define PARSE_TXT_READER_H

#include <bits/stdc++.h>
#include "page.h"
using namespace std;

struct AbstractParser {
    virtual void parse(Page page) = 0;

    virtual ~AbstractParser() {}
};

struct TxtReader {
    ifstream in = ifstream("results/ruwiki-my.txt");

    TxtReader() {
        assert(in);
    }

    void readTo(AbstractParser &parser, int number_pages = -1) {
        readToLambda([&parser](Page page) { parser.parse(page); }, number_pages);
    }

    template<typename Lambda>
    void readToLambda(Lambda lambda, int number_pages = -1) {
        Page page;
        int ipage = 0;
        while ((in >> page) && (number_pages == -1 || ipage++ < number_pages)) {
            lambda(page);
        }
    }
};

#endif //PARSE_TXT_READER_H
