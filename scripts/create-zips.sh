#!/bin/bash

cd examples

for dir in */; do
  # Use the -x option to exclude node_modules
  zip -r "../zips/${dir%/}.zip" "$dir" -x "*node_modules/*"
done

cd ..