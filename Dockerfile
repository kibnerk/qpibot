FROM node:14
WORKDIR /usr/src/app
COPY . .

RUN yarn install
EXPOSE 3000

CMD [ "yarn", "start:prod" ]
