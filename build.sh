#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing client dependencies..."
npm install --prefix client

echo "Building client..."
cd client
npm run build
