#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy.sh <hetzner-ip> <domain>
# Example: ./scripts/deploy.sh 65.108.x.x happyrobot-api.johanhyldig.dk
#
# Prerequisites:
#   1. SSH access to the server (ssh root@<ip>)
#   2. DNS A record pointing <domain> to <ip>
#   3. A .env file in the project root with production values

SERVER_IP="${1:?Usage: deploy.sh <server-ip> <domain>}"
DOMAIN="${2:?Usage: deploy.sh <server-ip> <domain>}"
APP_DIR="/opt/happyrobot"

echo "==> Deploying to ${SERVER_IP} with domain ${DOMAIN}"

# Install Docker if not present
ssh "root@${SERVER_IP}" << 'INSTALL'
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable --now docker
fi
INSTALL

# Sync project files
echo "==> Syncing files..."
rsync -avz --exclude '.venv' --exclude '__pycache__' --exclude '.env' \
    --exclude 'pgdata' --exclude '.git' \
    ./ "root@${SERVER_IP}:${APP_DIR}/"

# Copy .env and set domain
echo "==> Configuring environment..."
scp .env "root@${SERVER_IP}:${APP_DIR}/.env"
ssh "root@${SERVER_IP}" "echo 'DOMAIN=${DOMAIN}' >> ${APP_DIR}/.env"

# Build and start
echo "==> Starting services..."
ssh "root@${SERVER_IP}" << REMOTE
cd ${APP_DIR}
docker compose down || true
docker compose build --no-cache
docker compose up -d
echo "==> Waiting for services to start..."
sleep 5
docker compose ps
echo ""
echo "==> Health check:"
curl -s http://localhost:8000/api/v1/health || echo "API not ready yet, check logs with: docker compose logs api"
echo ""
echo "==> Deployment complete! API available at https://${DOMAIN}"
REMOTE
