#!/bin/bash
app=$APPLICATION
env=$TRACK
target=""

for i in "$@"
do
  case $i in
    *)
      # ignore
      shift # past argument=value
    ;;
  esac
done

if [[ $env == "" ]]
then
  echo "No env mentioned."
  exit 2
fi

echo "Building ${app} for ${env}."

set -ex

# clear build folder
# Dockerfile will have run `npm install` already. No need to run again.
# npm install
cp default.env .env

if [[ -f $env.env ]]
then
  cp $env.env .env
fi

# build dist
echo "building allaboard-ui assets..."
cd /app
PUBLIC_PATH="https://${CF_ASSETS_BASE_DOMAIN}/${APPLICATION}/${TRACK}/" npm run build:prod

set -ex
