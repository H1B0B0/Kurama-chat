FROM node:21
WORKDIR /app/src
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000
RUN npm run build
CMD ["npm", "start" ]