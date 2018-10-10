FROM node:10.9.0-alpine

# modify to shanghai timezone
RUN apk add --no-cache tzdata &&\
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime &&\
		apk del tzdata

COPY ./app /usr/local/app

WORKDIR /usr/local/app

EXPOSE 8080

CMD ["sh", "-c", "npm run prod"]
