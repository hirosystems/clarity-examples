#!/bin/bash

cd examples

for dir in */; do
  zip -r "../zips/${dir%/}.zip" "$dir"
done

cd ..
