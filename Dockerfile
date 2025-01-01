# Use Node 20 as the base image
FROM nexus.bcbst.com:8096/node:20

# Env args for redirection
# The below line acts as a key for the CI/CD to provide the environment specific Client Side values. It will be replaced in the deployment pipeline.
# DO NOT CHANGE THE BELOW LINE
# <Insert env args here>

ARG NEXT_PUBLIC_SILVER_FIT=https://www.silverandfit.com/
ARG NEXT_PUBLIC_ALIGHT=https://mymedicalally.alight.com/s/login/
ARG NEXT_PUBLIC_HINGE_HEALTH=https://hinge.health/bcbstnfi
ARG NEXT_PUBLIC_QUEST_SELECT=https://www.questselect.com/
ARG NEXT_PUBLIC_ABLETO=https://member.ableto.com/bcbst/
ARG NEXT_PUBLIC_HINGE_HEALTH_AMERCAN_ADDICTION_CENTERS=https://hinge.health/americanaddictioncenters
ARG NEXT_PUBLIC_HINGE_HEALTH_BCBST_EMPLOYEE=https://hinge.health/bcbst
ARG NEXT_PUBLIC_HINGE_HEALTH_BELMONT_UNIVERSITY=https://hinge.health/belmontuniversity
ARG NEXT_PUBLIC_HINGE_HEALTH_CARLEX=https://hinge.health/carlex
ARG NEXT_PUBLIC_HINGE_HEALTH_CITY_OF_MEMPHIS=https://hinge.health/cityofmemphis
ARG NEXT_PUBLIC_HINGE_HEALTH_DIOCESE_OF_NASHVILLE=https://hinge.health/dioceseofnashville
ARG NEXT_PUBLIC_HINGE_HEALTH_FRONTDOOR=https://hinge.health/frontdoor
ARG NEXT_PUBLIC_HINGE_HEALTH_MOUNTAIN_ELECTRIC=https://hinge.health/mountainelectric
ARG NEXT_PUBLIC_HINGE_HEALTH_NEMAK=https://hinge.health/nemak
ARG NEXT_PUBLIC_HINGE_HEALTH_OAKRIDGE=https://hinge.health/oakridge
ARG NEXT_PUBLIC_HINGE_HEALTH_STATETN=https://hinge.health/statetn
ARG NEXT_PUBLIC_HINGE_HEALTH_SUMMIT_MEDICAL=https://hinge.health/summitmedical
ARG NEXT_PUBLIC_HINGE_HEALTH_STRATAS_FOODS=https://hinge.health/stratasfoods
ARG NEXT_PUBLIC_HINGE_HEALTH_ACH_FOODS=https://hinge.health/achfoods
ARG NEXT_PUBLIC_HINGE_HEALTH_MONOGRAM=https://hinge.health/monogram
ARG NEXT_PUBLIC_HINGE_HEALTH_CITY_OF_FRANKLIN=https://hinge.health/cityoffranklin
ARG NEXT_PUBLIC_HINGE_HEALTH_BARNHART=https://hinge.health/barnhart
ARG NEXT_PUBLIC_HINGE_HEALTH_SKMES=https://hinge.health/skmes
ARG NEXT_PUBLIC_HINGE_HEALTH_SOUTHERN_LAND_COMPANY=https://hinge.health/southernlandcompany
ARG NEXT_PUBLIC_HINGE_HEALTH_SUMMIT_BEHAVIORAL=https://hinge.health/summitbehavioral
ARG NEXT_PUBLIC_HINGE_HEALTH_UNAKA=https://hinge.health/unaka
ARG NEXT_PUBLIC_HINGE_HEALTH_UPRIGHT_HOLDINGS=https://hinge.healh/uprightholdings
ARG NEXT_PUBLIC_HINGE_HEALTH_EAST_MAN_CREDIT=https://hinge.health/eastmancredit
ARG NEXT_PUBLIC_HINGE_HEALTH_DEFAULT=https://Hingehealth.com

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
