<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Rick and Morty API Backend 🛠️

This project is a backend implemented with [NestJS](https://github.com/nestjs/nest) and [PostgreSQL](https://www.postgresql.org/) to manage data from the Rick and Morty API. It includes functionality to import characters, perform basic operations, and query data with pagination and filtering.

## Project Description 📖

The project allows you to:

- **Load** up to 200 characters from the Rick and Morty API into the database.
- **List** and filter characters by name with pagination.
- **Update** the database with new characters every 30 minutes through a cron job.
- **Manually refresh** the database via an endpoint.

## Requirements 🚀

To run this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Installation 🛠️

Clone the repository and navigate to the project folder:

```bash
git clone https://github.com/cristianManco/HousyHost_Technical_Test.git

cd HousyHost_Technical_Test
```

Install the project dependencies:

```bash
npm install
```

## Configuration 🔧

Create a `.env` file in the root of the project with the following configuration:

```.env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=yourpassword
DATABASE_DB=characters_db
PORT=3000
```

Make sure to replace `yourpassword` and your `username` with your PostgreSQL database credentials.

## Running the Project 🚀

### Development

To start the server in development mode:

```bash
npm run start:dev
```

### Production

To start the server in production mode:

```bash
npm run start:prod
```

### With Docker Compose

You can run the project using a PostgreSQL database with Docker Compose. Make sure to have a `docker-compose.yml` file in the root of the project with the following configuration:

```yaml
version: '3.8'

services:
  db:
    image: postgres:13-alpine
    container_name: technical_test
    restart: always
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: HousyHost
      POSTGRES_PASSWORD: HousyHost123
    volumes:
      - ./postgres_data:/var/lib/postgresql/data
    ports:
      - 5432:5432
  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: HousyHost@nestjs.com
      PGADMIN_DEFAULT_PASSWORD: HousyHost123
      PGADMIN_LISTEN_PORT: 80
    ports:
      - 8080:80
    volumes:
      - ./pgadmin_data:/var/lib/pgadmin
    depends_on:
      - db
```

Then, start the services with:

```bash
docker-compose up --build
```

## API Endpoints 📡

### List Characters

- **Endpoint**: `/api/characters/all`
- **Method**: `GET`
- **Query Parameters**:
  - `name` (optional): Filter characters by name.
  - `page` (optional): Page number for pagination (default: 1).
  - `limit` (optional): Number of characters per page (default: 10).

**Request Example**:

```http
GET /api/characters/all?name=Rick&page=1&limit=10
```

**Response Example**:

```json
[
  {
    "id": 1,
    "name": "Rick Sanchez",
    "status": "Alive",
    "species": "Human",
    "gender": "Male",
    "location": "Earth"
  },
  ...
]
```

### Refresh Characters

- **Endpoint**: `/api/characters/refresh`
- **Method**: `POST`

**Request Example**:

```http
POST /api/characters/refresh
```

**Response Example**:

```json
{
  "message": "Characters refreshed successfully"
}
```

## Testing 🧪

To run unit and integration tests:

```bash
npm run test
```

To run coverage tests:

```bash
npm run test:cov
```

## Documentation 📚

API documentation is available on [Swagger](http://localhost:3000/api/docs) when the server is running.

## Support 🛠️

If you encounter any issues or have questions, feel free to open an [issue](https://github.com/your-repo/issues) on the repository.

## Author 👤

- **Cristian Manco** - [GitHub](https://github.com/cristianManco)

## License 📜

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---