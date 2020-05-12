#!/bin/bash
cd "$(dirname "$0")"
cd ../..

if [ -z "$GITHUB_CONTEXT" ]
then
  echo "Manual script execution detected with ENV=$ENV"

  echo "Starting environment setup"

  API_TOKEN=$(<~/.base/base.json)

  echo "1. Skipping action package installation of npm dependencies"
  #npm install

  echo "2. Installing npm dependencies for deployment"
  cd ./.github/scripts/
  npm install superagent archiver
  cd ../..

  echo "Environment setup complete"

  echo "Starting deployment"
  API_TOKEN=$API_TOKEN node ./.github/scripts/deploy_action_package.js
  echo "Deployment complete"
else
  echo "Github workflow starting"

  echo "Starting environment setup"

  echo "1. Installing npm dependencies for action package"
  npm install

  echo "2. Installing npm dependencies for deployment"
  cd ./.github/scripts/
  npm install superagent archiver
  cd ../..

  echo "Environment setup complete"

  echo "Starting deployment"
  node ./.github/scripts/deploy_action_package.js
  echo "Deployment complete"
fi
