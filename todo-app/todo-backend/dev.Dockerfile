FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install -g nodemon

CMD ["npm", "run", "start"]