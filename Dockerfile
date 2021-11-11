FROM node:latest

WORKDIR /mnt
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN chmod +x ./scripts/*.sh


