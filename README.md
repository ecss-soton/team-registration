# Hackathon team registration

A service to create and join teams to compete in a hackathon or other competition

TODO
- Add more info to teams page
- Display an error message if you try and join a team that doens't exist
- Have follow through links so you can click a link to join a team and register at the same time
- Allow profile editing
- Allow team leaders to kick team members

## Run Locally

Clone the project

```bash
  git clone https://github.com/ecss-soton/team-registration.git
```

Go to the project directory

```bash
  cd team-registration
```

Install dependencies

```bash
  npm install
```

Have a PostgreSQL server running

Configure the environment variables. See [Environment Variables]

Sync the database with the local schema

```bash
  npm run prisma:dbpush
```

Start the server

```bash
  npm run start
```

Or start with auto refresh in development mode

```bash
  npm run dev
```

### Environment Variables

To run this project, you will need to copy the `.env.development` to `.env` and fill in the secrets

The required environment variables are:

- `AZURE_AD_CLIENT_SECRET` Create a new app registration in Azure AD and use the client secret
- `AZURE_AD_CLIENT_ID` Create a new app registration in Azure AD and use the client id
- `SOTON_VERIFY_API_AUTH` The API key for the sotonverify API either get a live key (contact ECSS web officer) or run your own instance of [sotonverify](https://github.com/ecss-soton/verify)
- `DATABASE_URL` Connection URI for the PostgreSQL database

### Docker image

Find our docker image on [Docker hub](https://hub.docker.com/r/ecss/web_teamreg)

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Documentation

### Authorization

All requests must supply a `Authorization` HTTP header in the format: `Authorization: TOKEN`

#### Example Authorization header

```
Authorization: b583ef41-9c75-41a4-b4ec-19feb0befbd6
```

### Rate limiting

Currently, there are no rate limits in place

### API Reference
