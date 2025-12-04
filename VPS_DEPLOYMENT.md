# VPS Deployment Guide

This guide will help you deploy the Smart Service Desk backend on your private VPS using Docker.

## Prerequisites

- A VPS with Ubuntu/Debian (or similar Linux distribution)
- SSH access to your VPS
- Docker and Docker Compose installed on VPS

---

## Step 1: Install Docker on VPS

SSH into your VPS and run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

---

## Step 2: Prepare Your Code

### Option A: Clone from GitHub (Recommended)

```bash
# On your VPS
cd ~
git clone <your-repo-url> smart-service-desk
cd smart-service-desk
```

### Option B: Upload Files via SCP

From your local machine:

```bash
scp -r . user@your-vps-ip:/home/user/smart-service-desk
```

---

## Step 3: Configure Environment Variables

Create a `.env` file on your VPS:

```bash
cd ~/smart-service-desk
nano .env
```

Add these variables:

```env
MONGO_URI=mongodb+srv://faisalfansa_db_user:MoKa%402001@smart-service-desk.d5vcula.mongodb.net/smart-service-desk?retryWrites=true&w=majority
JWT_SECRET=6059067675ef78b921bfd37d428fb154ac629dea3c61ad4c3e61fff72e340b7f
NODE_ENV=production
PORT=18473
```

**OR** if using local MongoDB (docker-compose), use:

```env
MONGO_URI=mongodb://mongo:27017/smart-service-desk
JWT_SECRET=6059067675ef78b921bfd37d428fb154ac629dea3c61ad4c3e61fff72e340b7f
NODE_ENV=production
PORT=18473
```

Save and exit (Ctrl+X, then Y, then Enter).

---

## Step 4: Deploy with Docker

### Option A: Using Docker Compose (Recommended - includes MongoDB)

```bash
# Build and start containers
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### Option B: Using Docker Only (with external MongoDB)

```bash
# Build the image
docker build -t smart-service-desk-backend .

# Run the container
docker run -d \
  --name smart-service-desk-backend \
  --restart unless-stopped \
  -p 18473:18473 \
  --env-file .env \
  -v $(pwd)/uploads:/app/uploads \
  smart-service-desk-backend

# View logs
docker logs -f smart-service-desk-backend
```

---

## Step 5: Configure Firewall

```bash
# Allow port 18473 (or your chosen port)
sudo ufw allow 18473/tcp

# If using MongoDB locally, allow port 27017
sudo ufw allow 27017/tcp

# Enable firewall
sudo ufw enable
```

---

## Step 6: Set Up Reverse Proxy (Optional but Recommended)

### Using Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create config file
sudo nano /etc/nginx/sites-available/smart-service-desk
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:18473;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support for Socket.io
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/smart-service-desk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 7: Set Up SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## Management Commands

### View Logs
```bash
# Docker Compose
docker compose logs -f backend

# Docker only
docker logs -f smart-service-desk-backend
```

### Stop/Start/Restart
```bash
# Docker Compose
docker compose stop
docker compose start
docker compose restart

# Docker only
docker stop smart-service-desk-backend
docker start smart-service-desk-backend
docker restart smart-service-desk-backend
```

### Update Application
```bash
cd ~/smart-service-desk
git pull  # If using Git
docker compose build --no-cache
docker compose up -d
```

### Remove Everything
```bash
# Docker Compose
docker compose down -v

# Docker only
docker stop smart-service-desk-backend
docker rm smart-service-desk-backend
docker rmi smart-service-desk-backend
```

---

## Troubleshooting

### Check if container is running
```bash
docker ps
```

### Check container logs
```bash
docker logs smart-service-desk-backend
```

### Access container shell
```bash
docker exec -it smart-service-desk-backend sh
```

### Check MongoDB connection
```bash
# If using docker-compose MongoDB
docker exec -it smart-service-desk-mongo mongosh

# Test connection
use smart-service-desk
show collections
```

### Port already in use
```bash
# Find process using port 18473
sudo lsof -i :18473

# Kill process
sudo kill -9 <PID>
```

---

## Security Recommendations

1. **Change default passwords** - Update MongoDB credentials
2. **Use strong JWT_SECRET** - Generate a new one
3. **Enable firewall** - Only open necessary ports
4. **Use SSL/HTTPS** - Set up Let's Encrypt
5. **Regular updates** - Keep Docker and system updated
6. **Backup MongoDB** - Set up regular backups
7. **Monitor logs** - Check logs regularly for issues

---

## Backup MongoDB

```bash
# Backup (if using docker-compose)
docker exec smart-service-desk-mongo mongodump --out /data/backup

# Restore
docker exec smart-service-desk-mongo mongorestore /data/backup
```

---

## Your Application URLs

- **Local:** http://localhost:18473
- **VPS IP:** http://your-vps-ip:18473
- **With Domain:** https://your-domain.com (if configured)

Test the health endpoint:
```bash
curl http://localhost:18473/health
```

---

## Next Steps

1. ✅ Deploy the application
2. ✅ Configure domain (optional)
3. ✅ Set up SSL (optional)
4. ✅ Configure backups
5. ✅ Set up monitoring (optional)

Your backend is now running on your VPS! 🚀

