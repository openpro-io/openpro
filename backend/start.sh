#!/usr/bin/env sh

echo "Running migrations..."
pnpm migrate:up

# Check the exit code of the last command
if [ $? -ne 0 ]; then
  echo "Migrations failed, exiting..."
  exit 1
fi

echo "Starting server..."
pm2-runtime start pm2.config.json
