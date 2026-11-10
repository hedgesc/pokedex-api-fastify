FROM node:26-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "dock"]
