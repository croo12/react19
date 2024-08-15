FROM node:18.18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm run build
EXPOSE 5173
CMD ["node", "dist/server.js"] 