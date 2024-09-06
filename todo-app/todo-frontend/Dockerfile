FROM node:20

WORKDIR /usr/src/app

COPY . .

ENV VITE_BACKEND_URL=redis://localhost:6379

CMD DEBUG=todo-frontend:* npm start