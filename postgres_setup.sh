#!/bin/bash

sudo apt-get update
sudo apt-get install postgresql postgresql-contrib libpq-dev
sudo service postgresql start