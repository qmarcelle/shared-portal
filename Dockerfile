# Use Node 20 as the base image
FROM nexus.bcbst.com:8096/node:20

# Env args for redirection
ARG NEXT_PUBLIC_SILVER_FIT=https://www.silverandfit.com/
ARG NEXT_PUBLIC_ALIGHT=https://mymedicalally.alight.com/s/login/
ARG NEXT_PUBLIC_HINGE_HEALTH=https://hinge.health/bcbstnfi

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
