FROM node:latest AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-prod

FROM nginx:latest
COPY --from=build /app/dist/app/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80