FROM node:20

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/index.js"]
