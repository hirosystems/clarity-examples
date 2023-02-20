#!/bin/bash

cd examples

for dir in */; do
  zip -r "${dir%/}.zip" "$dir"
done

cd ..
