#!/bin/bash

# Agribook VPS Setup Script
# Run this on your Hostinger VPS

set -e  # Exit on error

echo "🚀 Starting Agribook VPS Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo "Node version: $(node -v)"

# 3. Install PM2 and Nginx
echo "🛠 Installing PM2 and Nginx..."
sudo npm install -g pm2
sudo apt install -y nginx certbot python3-certbot-nginx

# 4. Setup Project Directory
echo "xor Creating project directory..."
sudo mkdir -p /var/www/agribook
sudo chown -R $USER:$USER /var/www/agribook

# 5. Clone Repository
echo "📥 Cloning repository..."
if [ -d "/var/www/agribook/.git" ]; then
    echo "Repo already exists, pulling updates..."
    cd /var/www/agribook
    git pull origin main
else
    git clone https://github.com/Uebook/agribook.git /var/www/agribook
    cd /var/www/agribook
fi

# 6. Install Dependencies & Build
echo "📦 Installing dependencies..."
npm install # Root dependencies (proxy)

echo "🏗 Building Admin Panel..."
cd admin
npm install
# Note: You might need to set up .env.production here manually if not committed
if [ ! -f .env.production ] && [ ! -f .env.local ]; then
    echo "⚠️  WARNING: .env.production not found in admin/. Please create it."
    echo "Creating a placeholder .env.production..."
    echo "NEXT_PUBLIC_APP_URL=https://agriebookhub.in" > .env.production
fi
npm run build
cd ..

echo "🏗 Building Website..."
cd website-next
npm install
npm run build
cd ..

# 7. Start Services with PM2
echo "🚀 Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash # Execute the command pm2 startup tells us to

# 8. Setup Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/agriebookhub.in > /dev/null <<EOF
server {
    listen 80;
    server_name agriebookhub.in www.agriebookhub.in;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/agriebookhub.in /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Deployment Scripts Completed!"
echo "👉 Next steps:"
echo "1. If you haven't set up SSL yet, run: sudo certbot --nginx -d agriebookhub.in"
echo "2. Make sure your .env files are correct in /var/www/agribook/admin and /var/www/agribook/website-next"
