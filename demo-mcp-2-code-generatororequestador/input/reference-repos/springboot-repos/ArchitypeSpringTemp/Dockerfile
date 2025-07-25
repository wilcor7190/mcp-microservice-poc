FROM adoptopenjdk:11-jre-openj9

VOLUME /tmp
EXPOSE 8080

COPY ./target/${appName}-${version}.jar ./

ENTRYPOINT ["java","-jar","./${appName}-${version}.jar"]