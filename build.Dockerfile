# Use the official Node.js image as a build stage to compile TypeScript code
FROM node:16 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) for installing dependencies
COPY package*.json ./

# Install dependencies, including 'typescript' and any other compile-time dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Use the official Node.js image for the runtime stage
FROM node:16

# Set the working directory in the runtime container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing production dependencies
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy the compiled JavaScript code from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Your application listens on port 3000, so expose that port
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "dist/app.js" ]