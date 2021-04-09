#!/bin/bash

set -f

# Delete Old Repo
rm -rf /home/guillaumeh/blog

# Clone repo again
git clone https://gitlab.com/guillaumehanotel/traficmag-api.git

# Install App
cd /home/guillaumehanotel/traficmag-api
cp .env.example .env
npm install

# Restart process
pm2 restart 0
