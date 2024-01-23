FROM node:21
WORKDIR /front/src/
COPY package*.json ./ 
RUN npm install 
COPY . . 
EXPOSE 3000
CMD [ "npm", "run", "build", "&&", "npm", "start" ]