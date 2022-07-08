FROM node:alpine
WORKDIR /backend

COPY db                 /backend/db
COPY pub                /backend/pub
COPY util               /backend/util
COPY wheels             /backend/wheels
COPY service            /backend/service
COPY config             /backend/config
COPY index.js           /backend/index.js
COPY package.json       /backend/package.json
COPY package-lock.json  /backend/package-lock.json
COPY .env               /backend/.env

RUN npm ci --production

CMD [ "node", "index.js" ]
