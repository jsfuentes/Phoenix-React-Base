# ReactPhoenix

This base project uses a boilerplate Phoenix along with a custom Typescript React frontend. It also comes with the following:

- Default frontend file structure with folder for types, contexts, and api calls
- Default components and pages including a Homepage, Login, and 404 Page
- React Router setup with Code Splitting and Lazy Loading
- `debug` setup offering a better color coded version of console.log
- `react-toastify` setup
- Sentry setup on both backend and frontend
- conf folder with a similar interface to the npm package `config`
- blazing fast esbuild-loader webpack config beating babel-loader by 80%
- Default user creation and user context

## Initial Setup

Put your environment variables in `/.env`, use sample.env to see what variables you need

```
mix deps.get #Install deps
cd assets  #Install clientside npm packages
npm i
cd ..
source .env #Seed environment
mix phx.server #Start server
```

## Running

```
iex -S mix phx.server
```

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Learn more

- Official website: https://www.phoenixframework.org/
- Guides: https://hexdocs.pm/phoenix/overview.html
- Docs: https://hexdocs.pm/phoenix
- Forum: https://elixirforum.com/c/phoenix-forum
- Source: https://github.com/phoenixframework/phoenix
