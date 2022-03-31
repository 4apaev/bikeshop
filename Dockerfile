FROM node:alpine
WORKDIR /bikeshop

COPY db                 /bikeshop/db
COPY pub                /bikeshop/pub
COPY util               /bikeshop/util
COPY wheels             /bikeshop/wheels
COPY service            /bikeshop/service
COPY config             /bikeshop/config
COPY index.js           /bikeshop/index.js
COPY package.json       /bikeshop/package.json
COPY package-lock.json  /bikeshop/package-lock.json
COPY .env               /bikeshop/.env

RUN npm ci --production

CMD [ "node", "index.js" ]
