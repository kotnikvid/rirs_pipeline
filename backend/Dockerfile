# Use Node.js as the base image
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire project
COPY . .

# Expose the application's port (default for Express is usually 3000)
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]