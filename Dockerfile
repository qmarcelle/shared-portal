# Use Node 20 as the base image
FROM nexus.bcbst.com:8096/node:20

# Env args for redirection
ARG NEXT_PUBLIC_REGISTER_NEW_ACCOUNT=https://test.bcbst.com/register-member/
ARG NEXT_PUBLIC_PASSWORD_RESET=https://test.bcbst.com/forgot-password/
ARG NEXT_PUBLIC_LOGIN_REDIRECT_URL=https://members-gdev.bcbst.com/wps/myportal/member/
ARG NEXT_PUBLIC_LOGOUT_REDIRECT_URL=https://sso1.bcbst.com/idp/startSLO.ping?TargetResource=https://portals-gdev.bcbst.com/login
ARG NEXT_PUBLIC_PORTAL_URL='https://test.bcbst.com/'
ARG NEXT_PUBLIC_ENV_ID='DEV'
ARG NEXT_PUBLIC_PORTAL_ERROR_URL='https://www.bcbst.com/error/'
ARG NEXT_PUBLIC_PORTAL_ContactUS_URL='https://test.bcbst.com/contact-us'

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
