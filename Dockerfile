FROM node:18.18
WORKDIR /app
ADD ./dist /app
RUN npm install
EXPOSE 5173
CMD npm start