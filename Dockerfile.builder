# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=23.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION} AS base
ADD nscacert.pem /usr/local/share/ca-certificates/cacert.crt
RUN chmod 644 /usr/local/share/ca-certificates/cacert.crt
#RUN apk --no-cache add --no-check-certificate ca-certificates
RUN update-ca-certificates
RUN npm config set strict-ssl false
# Set working directory for all build stages.
WORKDIR /root

RUN apt-get update -y && apt-get upgrade -y;
RUN apt-get install -y curl git unzip xz-utils zip libglu1-mesa
#RUN apt-get install libc6:amd64 libstdc++6:amd64 lib32z1 libbz2-1.0:amd64
RUN curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz
RUN ls -la ~
RUN tar -xf ~/flutter_linux_3.24.5-stable.tar.xz -C ~/
RUN echo 'export PATH="~/flutter/bin:$PATH"' >> ~/.bash_profile
RUN ls -la ~/flutter
RUN ~/flutter/bin/flutter doctor --android-licenses

################################################################################
# Create a stage for installing production dependecies.
FROM base AS builder
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --force

# Copy the rest of the source files into the image.
COPY . .
COPY .env .
# Run the build script.

# Run the application as a non-root user.
#USER node

# Copy package.json so that package manager commands can be used.
COPY package.json .

# Run the application.
CMD npm run tsx:run-queue
