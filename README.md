# Record Tracker

A personal record tracking app built with ASP.NET Core and PostgreSQL.

## Features (Planned)
- Custom record types (e.g. grocery spending, meals spending, etc.)
- Dynamic fields per record type
- Record entry and data visualization
- User accounts and authentication

## Tech Stack
- ASP.NET Core 8
- EF Core + PostgreSQL
- FluentValidation, AutoMapper
- React (Next.js) frontend [planned]
- Docker + CI/CD [planned]

## Getting Started

### 🔧 Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [PostgreSQL 17+](https://www.postgresql.org/download/) (with pgAdmin optional)
- [Visual Studio 2022+](https://visualstudio.microsoft.com/) with **ASP.NET and web development** workload

### 🛠 Setup (Local Development)
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

## License
_TODO: Add a license if needed_

---

