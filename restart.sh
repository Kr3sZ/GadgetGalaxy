#!/bin/sh
docker-compose down -v --remove-orphans
docker-compose up --build
