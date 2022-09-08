#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building from build.sh..."
# Get ENV secrets
. ./.prod.env

# # Initial setup
mix deps.get --only prod
MIX_ENV=prod mix compile

# Compile assets
# Need -f because of new react version
npm install --legacy-peer-deps --force --prefix ./assets
npm run deploy --prefix ./assets
mix phx.digest

# Build the release and overwrite the existing release directory
MIX_ENV=prod mix release --overwrite
