FROM node:16-alpine
WORKDIR /usr/src/app
COPY . ./

RUN npm install
RUN npm run build
COPY . ./
EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
