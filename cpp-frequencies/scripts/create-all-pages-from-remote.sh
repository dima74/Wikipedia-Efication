#!/bin/sh -e
cd `dirname $0`/..
mkdir -p results
./scripts/download-ruwiki-my.sh | cmake-build-debug/all_pages >results/all-pages.txt