FROM node

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /app/package*.json ./

RUN npm install sequelize-cli nodemon -g && \
    npm install

COPY . .

EXPOSE 8080

CMD [ "nodemon", "/app/server.js" ]

