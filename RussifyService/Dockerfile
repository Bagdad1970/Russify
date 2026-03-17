FROM maven:3.9.12 as DEPS

WORKDIR /app

COPY pom.xml .
COPY Models/pom.xml Models/pom.xml
COPY RussifyService/pom.xml RussifyService/pom.xml

RUN mvn -B -e -C org.apache.maven.plugins:maven-dependency-plugin:3.9.0:go-offline

FROM maven:3.9.12 as BUILDER

WORKDIR /app

COPY --from=DEPS /root/.m2 /root/.m2
COPY --from=DEPS /app/ /app

COPY Models/src /app/Models/src
COPY RussifyService/src /app/RussifyService/src

RUN mvn -B -e clean install -DskipTests=true

FROM eclipse-temurin:24

WORKDIR /app

RUN mkdir /app/data

COPY --from=BUILDER /app/RussifyService/target/RussifyService-0.0.1-SNAPSHOT.jar .

CMD [ "java", "-jar", "/app/RussifyService-0.0.1-SNAPSHOT.jar" ]