FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copie du code source
COPY . .

# Port exposé par ton API Express (adapte si différent)
EXPOSE 3000

CMD ["node", "server.js"]