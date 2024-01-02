#!/usr/bin/env sh

echo "Running migrations..."
node dist/umzug-runner.js up

# Check the exit code of the last command
if [ $? -ne 0 ]; then
  echo "Migrations failed, exiting..."
  exit 1
fi

echo "Starting server..."
pm2-runtime start pm2.config.json
