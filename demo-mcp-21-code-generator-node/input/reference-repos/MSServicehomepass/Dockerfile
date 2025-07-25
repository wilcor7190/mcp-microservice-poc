FROM oraclelinux:8-slim@sha256:5048e9f7e59084ef4f1553da47681025d140c25eeedc45f82a3c3aefbd694fd4

ARG MAX_OLD_SPACE_SIZE=4096
ENV NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE}

RUN microdnf update -y && \
    microdnf install -y yum curl tar xz shadow-utils && \
    yum module install -y nodejs:18 && \
    yum install -y nodejs-18.19.0 && \
    yum -y install oracle-release-el8 && \
    yum -y install oracle-instantclient-release-el8 && \
    yum -y install oracle-instantclient-basic && \
    rm -rf /var/cache/yum && \
    yum clean all

WORKDIR /usr/src/app
COPY .npmrc .npmrc
COPY package.json ./
COPY src ./src
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN groupadd appgroup && useradd -g appgroup appuser
RUN npm install

RUN npm install -g @nestjs/cli
RUN npm run build
RUN rm -f .npmrc

RUN chown -R appuser:appgroup /usr/src/app
USER appuser

EXPOSE 8080
CMD ["node", "dist/main"]