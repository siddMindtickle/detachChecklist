#!/bin/bash

set -ex

#echo environment variables
env

# deploy allaboard assets
public_path="//${ASSETS_BUCKET}/${APPLICATION}/${TRACK}"
echo "pushing allaboard-ui assets to s3..."
s3Url="s3:${public_path}"

cd /app/dist

# compressed + cachable
aws s3 sync --acl public-read --cache-control max-age=25012345 --content-encoding gzip assests-ui/ $s3Url/assests-ui/

#static
aws s3 cp --acl public-read --cache-control max-age=0,no-cache,no-store,must-revalidate index.html $s3Url/index.html
aws s3 cp --acl public-read favicon.ico $s3Url/favicon.ico

set +ex
