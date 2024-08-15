FROM node:18.18
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5173
ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"] 