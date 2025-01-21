# Step 1: Define the base image to use
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install --production

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Expose the port that the application will run on (default for NestJS is 3000)
EXPOSE 3000

# Step 8: Define the command to run the application
CMD ["npm", "run", "start:prod"]
