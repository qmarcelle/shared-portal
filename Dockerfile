# Use Node 20 as the base image
FROM nexus.bcbst.com:8096/node:20

# Env args for redirection
# The below line acts as a key for the CI/CD to provide the environment specific Client Side values. It will be replaced in the deployment pipeline.
# DO NOT CHANGE THE BELOW LINE
# <Insert env args here>

# Set the working directory to /app
WORKDIR  /app

COPY package*.json ./

# this needs to be fied
RUN npm set strict-ssl false

RUN npm config set registry http://nexus.bcbst.com:8080/repository/npm-public/

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Build the TypeScript code
RUN npm run build

# Start the application
CMD [ "npm", "start"]
