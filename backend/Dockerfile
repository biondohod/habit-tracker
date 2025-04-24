FROM node:22

WORKDIR /app

COPY package.json package-lock.json nodemon.json tsconfig.json ./
RUN npm install

CMD ["npm", "run", "dev"]
