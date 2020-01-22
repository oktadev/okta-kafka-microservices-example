# Microservices Architecture with JHipster and Kafka

This repository contains a microservices architecture with Kafka support and includes docker-compose configuration for running the services locally. The tutorial for creating this example is available on the [Okta Developer Blog]().

**Prerequisites:**
- [Java 8](https://adoptopenjdk.net/)
- [Docker](https://docs.docker.com/install)
- [Docker Compose](https://docs.docker.com/compose/install)
- [Node.js](https://nodejs.org/en/)


## Getting Started

To install this example, run the following commands:

```bash
git clone https://github.com/oktadeveloper/okta-kafka-microservices-example.git jhipster-kafka
cd jhipster-kafka
```

### Create an Application in Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don’t have an account).

1. From the **Applications** page, choose **Add Application**.
2. On the Create New Application page, select **Web**.

Configure the following settings:

- Name: give a name for your application
- Login redirect URIs: 
  - `http://localhost:8080/login/oauth2/code/oidc`
  - `http://localhost:8761/login/oauth2/code/oidc`
- Logout redirect URIs:
  - `http://localhost:8080`
  - `http://localhost:8761`
- Grant Type Allowed: Authorization Code and Refresh Token

Copy the **Client ID** and **Client secret**, and find the **Org URL** at the top right corner in the Okta Dashboard.

### Run with Docker Compose

Create an `docker-compose/.env` file with the following content:

```
OIDC_CLIENT_ID={yourClientId}
OIDC_CLIENT_SECRET={yourClientSecret}
OIDC_ISSUER_URI={yourOrgUrl}/oauth2/default
MAIL_USERNAME{yourGmailUsername}
MAIL_PASSWORD={yourGmailPassword}
DISTRIBUTION_LIST={anotherEmailAccount}
```

Build the Docker images for the blog, store, and gateway apps by running the following command in each directory.

```bash
./mvnw -ntp -Pprod verify jib:dockerBuild
```

Once all the services are built, cd into the `docker-compose` directory and run them:

```bash
docker-compose up
```

Log in to the JHipster Registry at <http://localhost:8761> with your Okta user credentials and check each service's health.

Once everything is up, go to the gateway at <http://localhost:8080> and log in. Create a store entity **and** then update it. The `alert` microservice should log entries when processing the received message from the `store` service and you should receive an email.

## Links

- [JHipster: Using Kafka](https://www.jhipster.tech/using-kafka/)
- [Apache Kafka](https://kafka.apache.org/intro)

## Help

Please post any questions as comments on the [blog post](), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
