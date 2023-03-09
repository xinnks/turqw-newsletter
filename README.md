# TurQw Newsletter

A newsletter manager built using [Qwik] and [Turso].

For a walkthrough of how Turso works with Qwik in this application, [read my post
on Medium].

# Instructions

The following instructions assume that you have cloned this repo.

## Choose a local or remote backend

You can run this application in one of two ways:

- [Using a hosted Turso database](#using-a-hosted-turso-database) (recommended)
- [Using a local SQLite database](#using-a-local-sqlite-database)

### Using a hosted Turso database

Currently, in order to use Turso, you must [join the Turso private beta] to
request early access.

#### 1. Install the Turso CLI

Use one of the following commands:

```bash
# On macOS or Linux with Homebrew
brew install chiselstrike/tap/turso

# Manual scripted installation
curl -sSfL https://get.tur.so/install.sh | bash
```

#### 2. Create a Turso database using the CLI

This example uses the name "turqw", but you can choose any name:

```sh
turso db create turqw
```

Open the database using the Turso CLI’s SQL shell:

```sh
turso db shell turqw
```

#### 3. Configure the application with the Turso URL

Get the URL to the Turso database shown when opening the database using this
command.

![Turso db shell command]

We can obtain the Turso database URL by running the `turso db list` or `turso db
show` commands.

![Turso db list command]

Then, do the following:

- Rename the file `sample.env` to `.env`.
- Assign the database URL obtained in the previous step to the `VITE_DB_URL`
  environment variable.

#### 4. Create the newsletters table

Run `turso db shell turqw` to start an interactive shell with Turso.

Copy and paste the following table definition into the shell:

```sql
create table newsletters(
	id integer primary key,
	email varchar(255) not null,
	website varchar(50) not null,
	created_at integer default (cast(unixepoch() as int))
);
```

Copy and paste the following statements to create indexes for that table:

```sql
-- website column index
create index index_newsletters_website on newsletters (website);

-- email, website columns unique index
create unique index index_unique_newsletters_email_website on newsletters(email, website);
```

### Using a local SQLite database

If you do not have access to the private beta, you can run this project using a
local SQLite database file.

#### 1. Install SQLite

[Download and install SQLite] if it is not already installed on your machine.

#### 2. Create the database

Run the command `sqlite3 db/turqw.db` to create an SQLite file database to work
with.

![SQLite database creation]

<aside class="notice">
We are running the `.database` command in the above demonstration to see if
our database file was successfully created.
</aside>

#### 3. Configure the application with the path to the local database

- Rename the file `sample.env` to `.env`.
- Assign the to the database to the `VITE_DB_URL` environment variable.

```
VITE_DB_URL=db/turqw.db
```

#### 4. Create the newsletters table

Run the following command to create the table:

```sh
sqlite3 db/turqw.db "create table newsletters( id integer primary key, email varchar(255) not null, website varchar(50) not null, created_at integer default (cast(unixepoch() as int)))"
```

And these commands to add indexes:

```sh
# website column index
sqlite3 db/turqw.db "create index index_newsletters_website on newsletters (website)"

# email, website columns unique index
sqlite3 db/turqw.db "create unique index index_unique_newsletters_email_website on newsletters(email, website)"
```

## Project Structure

This project is using Qwik with [QwikCity]. QwikCity is just an extra set of
tools on top of Qwik to make it easier to build a full site, including
directory-based routing, layouts, and more.

Inside your project, you'll see the following directory structure:

```
├── public/
│   └── ...
└── src/
    ├── components/
    │   └── ...
    └── routes/
        └── ...
```

- `src/routes`: Provides the directory based routing, which can include a
  hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page.
  Additionally, `index.ts` files are endpoints. Please see the [Qwik routing
  docs] for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public
  directory. Please see the [Vite public directory] for more info.

## Running locally

Development mode uses [Vite's development server]. During development, the `dev`
command will server-side render (SSR) the output.

```shell
npm run start # or `yarn start`
```

## Preview

The preview command will create a production build of the client modules, a
production build of `src/entry.preview.tsx`, and run a local server. The preview
server is only for convenience to locally preview a production build, and it
should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

<aside class="notice">
Note: during dev mode, Vite may request a significant number of `.js` files.
This does not represent a Qwik production build.
</aside>

## Production

The production build will generate client and server modules by running both
client and server build commands. Additionally, the build command will use
Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```

## License

This code is open sourced under the [MIT license].


[Qwik]: https://qwik.builder.io/
[Turso]: https://chiselstrike.com/
[read my post on Medium]: https://blog.chiselstrike.com/creating-a-newsletter-manager-with-turso-and-qwik-675e42126897
[join the Turso private beta]: https://chiselstrike.com/
[Download and install SQLite]: https://www.sqlite.org/download.html
[QwikCity]: https://qwik.builder.io/qwikcity/overview/
[Qwik routing docs]: https://qwik.builder.io/qwikcity/routing/overview/
[Vite public directory]: https://vitejs.dev/guide/assets.html#the-public-directory
[Vite's development server]: https://vitejs.dev/
[MIT license]: https://en.wikipedia.org/wiki/MIT_License

[Turso db shell command]: https://res.cloudinary.com/djx5h4cjt/image/upload/v1678192236/chiselstrike-assets/Turso_edge_db_url_-_db_shell_command.jpg
[Turso db list command]: https://res.cloudinary.com/djx5h4cjt/image/upload/v1678192235/chiselstrike-assets/Turso_edge_db_url_-_db_list_command.jpg
[SQLite database creation]: https://res.cloudinary.com/djx5h4cjt/image/upload/v1678192236/chiselstrike-assets/SQLite3_database_creation.jpg
