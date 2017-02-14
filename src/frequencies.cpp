#include <bits/stdc++.h>
#include "ewords_parser.h"
using namespace std;

struct FrequenciesParser : public EwordsParser {
    void summary() {
        vector<EwordInfo> bests;
        for (pair<u32string, DwordInfo> p : infos) {
            EwordInfo best = p.second.getBest();
            if (best.number != best.numberAll) {
                bests.push_back(best);
            }
        }
        sort(bests.begin(), bests.end());
        for (EwordInfo best : bests) {
            cout << best << endl;
        }
    }
};

int main() {
//    freopen("results/ruwiki-my.txt", "r", stdin);
//    freopen("results/frequencies.txt", "w", stdout);
    FrequenciesParser parser;
    TxtReader().readTo(parser);
    parser.summary();
    return 0;
}