# Hackathon team registration

A service to create and join teams to compete in a hackathon or other competition

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

To run this project, you will need to add the following environment variables to your .env file

A list of these can also be seen in [.env.example](./.env.example)

```bash
NODE_ENV="development"
DATABASE_URL="In the form `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`"

NEXTAUTH_SECRET="Random bytes for auth crypto"
NEXTAUTH_URL="Absolute URL of the server"

# University of Southampton Azure AD Tenant ID - Change only if you want to auth with a different tenant ( ie univerisity account etc )
AZURE_AD_TENANT_ID="4a5378f9-29f4-4d3e-be89-669d03ada9d8"
AZURE_AD_CLIENT_SECRET="Your Azure AD OAuth application secret"
AZURE_AD_CLIENT_ID="Your Azure AD OAuth application client id"

SOTON_VERIFY_API_AUTH="API key for soton verify"
```

### Docker image

TODO Add docker image link with dockerfile

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