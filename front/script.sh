#!/bin/bash

cd app && npm install --no-bin-links && npm run serve

exec "$@"