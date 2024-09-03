FROM node:20

WORKDIR /usr/src/app

COPY . .

CMD DEBUG=part12-containers-applications-main:* npm start