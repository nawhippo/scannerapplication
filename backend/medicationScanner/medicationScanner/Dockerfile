FROM JDK
WORKDIR /src
COPY target/docker-java-jar-0.0.1-SNAPSHOT.jar app.jar
ARG JAR_FILE=target/*.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]