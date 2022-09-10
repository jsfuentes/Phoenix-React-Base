# ReactPhoenix

This base project builds off the boilerplate Phoenix app along with a custom React Redux Tailwind Typescript frontend.

The frontend has:

- React v18, [Tailwind v3](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), Webpack v5, and Typescript v4
- Form Library [react-hook-form](https://react-hook-form.com/)
- Default frontend file structure with folder for types, contexts, and api calls
- Default components and pages including a Button, Homepage, Login, and 404 Page
- Icon library [Boxicons](https://boxicons.com)
- `react-router` v6 setup with Code Splitting and Lazy Loading
- `debug` setup offering a better color coded version of console.log
- `react-toastify` setup
- conf folder with a similar interface to the npm package `config`
- blazing fast `esbuild-loader` webpack config beating babel-loader by 80%
- Redux Error Manager with redux actions to standardize error logging

The backend has:

- Advanced channel setup with Presence and broadcasting
- Genserver to store temporary state like Redis
- Custom plug to check for object ownership
- Tesla for api requests
- Swoosh for emails
- Ueberauth for Oauth
- Auth controller to handle both email and oauth login

And code for the following services, just add secrets to `.prod.env` for the backend and `assets/conf/default.js` and `assets/conf/producation.js` for the frontend:

- OpenAI (lib/react_phoenix/helpers/myopenai.ex)
- Logrocket or Posthog (assets/src/app.tsx)
- Sentry on both backend and frontend (assets/src/app.tsx and config/prod.exs)
- Google Login (assets/conf/default.js and config/prod.exs)
- Postmark emails (config/config.exs)

## Initial Setup

1. Install deps

```
mix deps.get #Install deps
cd assets  #Install clientside npm packages
npm i
cd ..
```

2. Generate Elixir keybase with `mix phx.gen.secret` and copy that long random string
3. Add the keybase to `sample.env` and rename it to `.prod.env`
4. Add all your DB info to `.prod.env`. You can either use a local Postgres DB or see Deployment below to deploy a DB.

## Running

```
iex -S mix phx.server
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Deployment

I recommend [Render](https://render.com) because of their generous free plan. You get a free 750 hours of shared server time a month and free 90 days of a Postgres DB.

The repo already has a build script `build.sh` and `render.yaml` file with the configuration Render needs to deploy a Postgres DB and Elixir web service.

### Steps

(Optional) Change the `- name:` of your Render Services to your Project Name in `render.yaml`

1. Deploy using the Blueprint option in [Render](https://render.com) by connecting to your Github Repo
2. Add the new DB's username, password, database, and host to `.prod.env`
3. Copy `.prod.env` and add it to the web services Environment/Secret File so it can be used in production without checking it in the repo

## Learn more

- Template Repo: https://github.com/jsfuentes/Phoenix-React-Base
- Phoenix Docs: https://hexdocs.pm/phoenix
- Elixir Forum: https://elixirforum.com/c/phoenix-forum
