FROM node:latest
ENV PORT=80
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
WORKDIR /app/build
EXPOSE 80
CMD [ "node", "index.js" ]