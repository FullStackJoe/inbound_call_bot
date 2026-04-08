#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh <hetzner-ip> <domain>
# Example: ./deploy.sh 65.108.x.x happyrobot-api.johanhyldig.dk
#
# Run from the deployment/ directory.
#
# Prerequisites:
#   1. SSH access to the server (ssh root@<ip>)
#   2. DNS A record pointing <domain> to <ip>
#   3. A .env file in api/ with production values

SERVER_IP="${1:?Usage: deploy.sh <server-ip> <domain>}"
DOMAIN="${2:?Usage: deploy.sh <server-ip> <domain>}"
REMOTE_DIR="/opt/happyrobot"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

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
echo "==> Syncing API files..."
rsync -avz --exclude '.venv' --exclude '__pycache__' --exclude '.env' \
    --exclude 'pgdata' --exclude '.git' \
    "${REPO_ROOT}/api/" "root@${SERVER_IP}:${REMOTE_DIR}/api/"

echo "==> Syncing UI files..."
rsync -avz --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
    "${REPO_ROOT}/frontend/" "root@${SERVER_IP}:${REMOTE_DIR}/frontend/"

echo "==> Syncing deployment files..."
rsync -avz "${REPO_ROOT}/deployment/" "root@${SERVER_IP}:${REMOTE_DIR}/deployment/"

# Copy .env and set domain
echo "==> Configuring environment..."
scp "${REPO_ROOT}/api/.env" "root@${SERVER_IP}:${REMOTE_DIR}/api/.env"
ssh "root@${SERVER_IP}" "echo 'DOMAIN=${DOMAIN}' >> ${REMOTE_DIR}/api/.env"

# Build and start
echo "==> Starting services..."
ssh "root@${SERVER_IP}" << REMOTE
cd ${REMOTE_DIR}/deployment
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
echo "==> Deployment complete!"
echo "    API: https://${DOMAIN}/api/v1/health"
echo "    UI:  https://${DOMAIN}"
REMOTE
