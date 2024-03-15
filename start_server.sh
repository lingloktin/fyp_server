#!/bin/bash

#shell script for starting the databsae and server

sudo service postgresql start
nodemon run server/server.js