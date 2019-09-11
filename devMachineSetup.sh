#!/bin/sh

npm i -g hotel
cp hotel.conf.json ~/.hotel/conf.json
npm install

hotel stop 
hotel start

networksetup -setautoproxyurl "Wi-Fi" "http://localhost:2000/proxy.pac"
echo "Turn Wifi Off and On, if not running this script for the first time"

hotel add "node start_proxy.js" --name "admin.mindtickle" --port 5011 -o proxy.log
hotel add "npm start" --name "ui-detachChecklist" --port 5000

hotel stop 
hotel start
sleep 5
open http://hotel.test
