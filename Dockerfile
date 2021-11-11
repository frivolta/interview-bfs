FROM node:16

WORKDIR /mnt
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

RUN chmod +x ./scripts/*




