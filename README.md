# TurQw Newsletter

A newsletter manager built using [Qwik](https://qwik.builder.io/) and [Turso](https://chiselstrike.com)

---

## Setting up the Turso database

To set up Turso, install it:
```bash
# On Mac
Brew install chiselstrike/tap/turso

# linux script
curl -sSfL https://get.tur.so/install.sh | bash
```

[Join the ChiselStrike private beta](https://chiselstrike.com) to acquire use access.

Create a new Turso database:

```sh
turso db create DATABASE_NAME
```

Open the database using the Turso CLI’s SQL shell:

```sh
turso db shell DATABASE_NAME
```

Get the URL to the Turso database shown when opening the database using this command.

![Turso db shell command](https://res.cloudinary.com/djx5h4cjt/image/upload/v1678192236/chiselstrike-assets/Turso_edge_db_url_-_db_shell_command.jpg)

We can obtain the Turso database URL by running the `turso db list` or `turso db show` commands.

![Turso db list command](https://res.cloudinary.com/djx5h4cjt/image/upload/v1678192235/chiselstrike-assets/Turso_edge_db_url_-_db_list_command.jpg)

Then, do the following:
- Rename the `sample.env` file to `.env`.
- Assign the database URL obtained in the previous step to the `VITE_DB_URL` environment variable.

## Project Structure

This project is using Qwik with [QwikCity](https://qwik.builder.io/qwikcity/overview/). QwikCity is just a extra set of tools on top of Qwik to make it easier to build a full site, including directory-based routing, layouts, and more.

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

- `src/routes`: Provides the directory based routing, which can include a hierarchy of `layout.tsx` layout files, and an `index.tsx` file as the page. Additionally, `index.ts` files are endpoints. Please see the [routing docs](https://qwik.builder.io/qwikcity/routing/overview/) for more info.

- `src/components`: Recommended directory for components.

- `public`: Any static assets, like images, can be placed in the public directory. Please see the [Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) for more info.

## Development

First, run `npm install` to install the project's dependencies.

Development mode uses [Vite's development server](https://vitejs.dev/). During development, the `dev` command will server-side render (SSR) the output.

```shell
npm run start # or `yarn start`
```

> Note: during dev mode, Vite may request a significant number of `.js` files. This does not represent a Qwik production build.

## Preview

The preview command will create a production build of the client modules, a production build of `src/entry.preview.tsx`, and run a local server. The preview server is only for convenience to locally preview a production build, and it should not be used as a production server.

```shell
npm run preview # or `yarn preview`
```

## Production

The production build will generate client and server modules by running both client and server build commands. Additionally, the build command will use Typescript to run a type check on the source code.

```shell
npm run build # or `yarn build`
```