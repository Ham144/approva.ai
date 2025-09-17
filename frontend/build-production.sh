#!/bin/bash

# Build script for production with proper MIME types

echo "🧹 Cleaning previous build..."
rm -rf dist/

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building for production..."
npm run build

echo "📋 Copying .htaccess to dist..."
cp .htaccess dist/ 2>/dev/null || echo "No .htaccess found, skipping..."

echo "✅ Production build completed!"
echo "📁 Build files are in: ./dist/"
echo ""
echo "🚀 Deployment instructions:"
echo "1. Upload contents of ./dist/ to your web server"
echo "2. Ensure your server has proper MIME type configuration:"
echo "   - Apache: Use the .htaccess file in dist/"
echo "   - Nginx: Use the nginx.conf configuration"
echo "3. Make sure JavaScript files are served with 'application/javascript' MIME type"
