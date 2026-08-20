#!/bin/bash

# Build script for production with automatic deployment to /var/www/approva-ai

# Target folder otomatis
TARGET_DIR="/var/www/approva-ai"

echo "🧹 Cleaning previous build..."
rm -rf dist/

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building for production..."
npm run build

echo "📋 Copying .htaccess to dist..."
cp .htaccess dist/ 2>/dev/null || echo "No .htaccess found, skipping..."

echo "🚀 Deploying to $TARGET_DIR..."

# Memastikan folder target sudah ada dengan hak akses root/sudo
sudo mkdir -p "$TARGET_DIR"

# Menyalin isi folder dist ke folder target menggunakan sudo
sudo rsync -avz --delete dist/ "$TARGET_DIR/"

# Otomatis perbaiki permission agar bisa dibaca oleh Caddy
echo "🔒 Fixing permissions for Caddy..."
sudo chown -R caddy:caddy "$TARGET_DIR"
sudo find "$TARGET_DIR" -type d -exec chmod 755 {} +
sudo find "$TARGET_DIR" -type f -exec chmod 644 {} +

echo "✅ Production build and deployment completed!"
echo "📁 Live files are now in: $TARGET_DIR"
