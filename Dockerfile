FROM node:14-alpine as build
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.17-alpine
WORKDIR iframe-entry
RUN mkdir signer-cloud
COPY nginx/webkeeper.conf /etc/nginx/conf.d/webkeeper.conf
COPY --from=build iframe-entry/dist/ /iframe-entry/signer-cloud/
EXPOSE 80
