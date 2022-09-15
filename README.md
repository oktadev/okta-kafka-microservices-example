# Microservices Architecture with JHipster and Kafka

This repository contains a microservices architecture with Kafka support and includes docker-compose configuration for running the services locally. The tutorial for creating this example is available on [Okta Developer Blog]().

**Prerequisites:**

- [Java 11+](https://adoptopenjdk.net/)
- [Docker 20.10.17](https://docs.docker.com/install)
- [Node.js 16.17.0](https://nodejs.org/en/)
- [Okta CLI 0.10.0](https://cli.okta.com/)

## Getting Started

To install this example, run the following commands:
```bash
git clone https://github.com/indiepopart/jhipster-kafka-cloud-stream.git
cd jhipster-kafka
```

### Create an Application in Okta

Before you begin, you’ll need a free Okta developer account. Install the Okta CLI and run `okta register` to sign up for a new account. If you already have an account, run `okta login`. Then, run `okta apps create jhipster`. Select the default app name, or change it as you see fit. Provide the following redirect URIs:

- login: http://localhost:8081/login/oauth2/code/oidc and http://localhost:8761/login/oauth2/code/oidc
- logout: http://localhost:8081 and http://localhost:8761

You will see output like the following when it’s finished:

```bash
Okta application configuration has been written to: /path/to/app/.okta.env
```

Run cat .okta.env (or type .okta.env on Windows) to see the issuer and credentials for your app. It will look like this (except the placeholder values will be populated):

```bash
export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER_URI="https://{yourOktaDomain}/oauth2/default"
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_ID="{clientId}"
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_SECRET="{clientSecret}"
```

### Run with Docker Compose

Create an `docker-compose\.env` file with the following content:

```
OIDC_CLIENT_ID={yourClientId}
OIDC_CLIENT_SECRET={yourClientSecret}
RESOURCE_ISSUER_URI={yourOrgUrl}/oauth2/default
MAIL_USERNAME{yourGmailUsername}
MAIL_PASSWORD={yourGmailAppPassword}
DISTRIBUTION_LIST={anotherEmailAccount}
```

**Note**: As the alerts email service is Gmail, a [Gmail App Password](https://support.google.com/accounts/answer/185833) is required for the SMTP authentication.

Build the services docker images for `blog`, `store` and `gateway` with the following command:

```bash
./mvnw -ntp -Pprod verify jib:dockerBuild
```

Once all the services are built, run docker-compose:

```bash
docker compose up
```

Login to the JHipster Registry at [**http://localhost:8761**](http://localhost:8761) with Okta user credentials and check the service's health.

Once everything is up, go to the gateway at http://localhost:8081 and login. Create store entity and then update it. The `alert` microservice should log entries when processing the received message from the `store` service.

## Links

- [JHipster: Using Kafka](https://www.jhipster.tech/using-kafka/)
- [Apache Kafka](https://kafka.apache.org/intro)


## Help

Please post any questions as comments on the [blog post](), or on the [Okta Developer Forums](https://devforum.okta.com/).

## License

Apache 2.0, see [LICENSE](LICENSE).
