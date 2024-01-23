FROM node:21
WORKDIR /back/src/
COPY package*.json ./
COPY public/ ./
RUN npm install 
COPY . . 
EXPOSE 3001
CMD [ "npm", "start" ]