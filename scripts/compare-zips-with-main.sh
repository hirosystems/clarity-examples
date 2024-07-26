#/bin/bash

# This script compares the current branch zip contents with the main zip contents
# helpful before merging to avoid any regression in the platform

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Create a temporary directory in the current directory
mkdir -p ./tmp-zips-main
mkdir -p ./tmp-zips-current

# Checkout to the main branch and copy the zips to the temporary directory
git checkout main
cp zips/*.zip ./tmp-zips-main/

# Checkout back to the original branch and copy the zips to the temporary directory
git checkout "$current_branch"
cp zips/*.zip ./tmp-zips-current/

# Extract the contents of the zip files into separate directories
mkdir -p ./tmp-zips-main/extracted
mkdir -p ./tmp-zips-current/extracted

for file in ./tmp-zips-main/*.zip; do
  filename=$(basename "$file")
  unzip -q "$file" -d "./tmp-zips-main/extracted/$filename"
done

for file in ./tmp-zips-current/*.zip; do
  filename=$(basename "$file")
  unzip -q "$file" -d "./tmp-zips-current/extracted/$filename"
done

# Compare the extracted contents of the zip files
echo "Comparing ZIP files between 'main' and '$current_branch' branches:"
for dir in ./tmp-zips-main/extracted/*; do
  dirname=$(basename "$dir")
  if [ -d "./tmp-zips-current/extracted/$dirname" ]; then
    diff_output=$(diff -r -q "./tmp-zips-main/extracted/$dirname" "./tmp-zips-current/extracted/$dirname")
    if [ "$diff_output" != "" ]; then
      echo "Difference found in $dirname:"
      echo "$diff_output"
    else
      echo "$dirname is identical in both branches."
    fi
  else
    echo "$dirname exists in 'main' but not in '$current_branch'."
  fi
done

# Cleanup
rm -rf ./tmp-zips-main ./tmp-zips-current
