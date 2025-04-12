# Base image
FROM node:18

# Working directory for container
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Application
COPY . .

# Port expoision
EXPOSE 80

# Run
CMD ["ng", "serve", "--host", "0.0.0.0", "--port","80"]
