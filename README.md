# Record Tracker

A personal highly customizable record tracking app built with **ASP.NET Core** and **Next.js**, using **PostgreSQL** for data storage.


This monorepo contains:

- [`/backend`](./backend) — ASP.NET Core 8 API
- [`/frontend`](./frontend) — Next.js app

---

## Features (Planned)
- Custom record types (e.g. grocery spending, meals spending, etc.)
- Dynamic fields per record type
- Record entry and data visualization
- User accounts and authentication
- More...

---

## Tech Stack
- ASP.NET Core 8 with EF Core + PostgreSQL
- React (Next.js) frontend
- Docker + CI/CD [planned]

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and `npm`
- [PostgreSQL 15+](https://www.postgresql.org/download/) (with pgAdmin optional)

---

### Backend Setup (`/backend`)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/record-tracker.git
   cd record-tracker
   ```

2. Setup PostgreSQL:
	- Set a password for the `postgres` user (default)
	- Password should match the `ConnectionStrings:DefaultConnection` in `appsettings.json`

3. Apply EF Core migrations:
	- Open the solution `RecordTracker.sln` in Visual Studio
	- Ensure you have the EF Core CLI tools installed:
	   ```bash
	   dotnet tool install --global dotnet-ef
	   ```
	- Open a terminal in the project root directory and run the following command to apply migrations:
	   ```bash
	   dotnet ef database update --context RecordTrackerDbContext
	   ```
	- Alternatively, you can run migrations from Visual Studio Package Manager Console:
	  Make sure to set RecordTracker.Infrastructure as the default project, then run:
	   ```powershell
	   Update-Database
	   ```

---

### Frontend Setup (/frontend)

1. From the project root:
	```bash
	cd frontend
	npm install
	npm run dev
	```

2. Run Eslint:
	```
	cd frontend
	npm run lint
	npm run lint:fix
	```
## License
_TODO: Add a license if needed_

---

