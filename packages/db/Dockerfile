FROM node:22.12

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

COPY do.crt /usr/local/share/ca-certificates/do.crt

COPY /packages/db/package.json ./packages/db/package.json

RUN apt-get update && apt-get install -y \
  postgresql \
  uuid-runtime

RUN update-ca-certificates

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/do.crt

RUN yarn install

ADD /packages/db ./packages/db
ADD /packages/db/setup.sh ./packages/db/setup.sh

CMD ["yarn", "workspace", "@omnivore/db", "migrate"]
