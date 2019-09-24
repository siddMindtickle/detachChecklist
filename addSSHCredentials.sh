#!/bin/sh
if [ -z "$1" ]
then
  mkdir -p ~/.ssh
  aws s3 cp --region ap-southeast-1 --recursive s3://mt-devops-data/heimdall/ssh/ ~/.ssh
  if [ $? -ne 0 ]
  then
    echo -e "Error while Getting Credentials from S3"
    exit 1
  fi
  chmod 600 ~/.ssh/id_rsa
  touch /root/.ssh/known_hosts
  ssh-keyscan github.com >> /root/.ssh/known_hosts
elif [ "$1" = "delete" ]
then
  rm -rf ~/.ssh
fi