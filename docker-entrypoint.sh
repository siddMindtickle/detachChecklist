#!/bin/bash

set -ex

#echo environment variables
env

# deploy allaboard assets
public_path="//${ASSETS_BUCKET}/${APPLICATION}/${TRACK}"
echo "pushing allaboard-ui assets to s3..."
s3Url="s3:${public_path}"

echo $public_path

cd /app/dist

# compressed + cachable
aws s3 sync --acl public-read --cache-control max-age=25012345 assests-ui/ $s3Url/assests-ui/

#static
aws s3 cp --acl public-read --cache-control max-age=0,no-cache,no-store,must-revalidate index.html $s3Url/index.html
aws s3 cp --acl public-read favicon.ico $s3Url/favicon.ico



utcTime=$(date +%s)
istTime=$(($utcTime+19800))
dates=$(date -r $istTime +%D-%T)
jobName="checklist_${dates}"

sleep 5s

curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"jobName":"'"$jobName"'","dataEndpointIds":[9]}'  http://webpagetest.checklist.mindtickle.com/app/createJob


set +ex
