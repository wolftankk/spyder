#!/bin/sh

cd $(dirname $0)
python2 -m unittest discover -s test -p "test_*.py"
