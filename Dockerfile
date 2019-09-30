# extend official node image
FROM node:8.6-stretch

# ensure installation
RUN node -v; npm -v
RUN npm install -g webpack
# install aws cli
RUN apt-get update && \
    apt-get install -y python-dev python-pip
RUN pip install awscli

# install application
ARG app="checklist-ui"
ENV APPLICATION=$app

ARG track="local"
ENV TRACK=$track

COPY addSSHCredentials.sh  /addSSHCredentials.sh
RUN chmod +x /addSSHCredentials.sh
RUN /addSSHCredentials.sh

## LEVERAGE DOCKER'S LAYERED CACHING
# IF NO FILE CHANGE WAS DETECTED, FOLLOWING COMMANDS WILL BE CACHED
COPY package*.json /app/
WORKDIR /app
RUN npm install

# NOW EVERYTHING ABOVE THIS LINE SHOULD BE CACHED.
COPY . /app
WORKDIR /app

ARG s3_base_domain="s3-ap-southeast-1.amazonaws.com"
ENV S3_BASE_DOMAIN=$s3_base_domain
ARG assets_bucket="mtapps-cdn.mindtickle.com"
ENV ASSETS_BUCKET=$assets_bucket
ARG cf_assets_base_domain="dnqlbe0jdvu8q.cloudfront.net"
ENV CF_ASSETS_BASE_DOMAIN=$cf_assets_base_domain

RUN bash build.sh

RUN /addSSHCredentials.sh "delete"
RUN rm /addSSHCredentials.sh

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
