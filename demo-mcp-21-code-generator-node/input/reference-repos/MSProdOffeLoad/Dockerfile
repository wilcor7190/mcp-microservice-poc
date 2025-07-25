FROM node:18.19-alpine@sha256:c7620fdecfefb96813da62519897808775230386f4c8482e972e37b8b18cb460

ARG MAX_OLD_SPACE_SIZE=4096
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

WORKDIR /usr/src/app
COPY .npmrc .npmrc
COPY package.json ./
COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    npm install && \
    npm install -g @nestjs/cli && \
    npm run build && \
    rm -f .npmrc && \
    chmod 777 /usr/src/app/dist/common/utils && \
    chown -R appuser:appgroup /usr/src/app    

COPY . .
RUN apk add --no-cache tzdata

USER appuser

ENV TZ=America/Bogota

EXPOSE 8080
CMD ["node", "dist/main"]