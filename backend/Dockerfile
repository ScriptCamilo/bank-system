FROM node:16.18.1-alpine

WORKDIR /app-back

COPY package*.json .

RUN npm install

COPY . .

# FIXME: Create Database table
RUN npx prisma generate

CMD [ "npm", "run", "db:push:dev" ]
