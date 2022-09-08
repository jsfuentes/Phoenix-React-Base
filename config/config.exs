# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :react_phoenix,
  ecto_repos: [ReactPhoenix.Repo]

# Configure your database
config :react_phoenix, ReactPhoenix.Repo,
  username: System.get_env("DB_USERNAME"),
  password: System.get_env("DB_PASSWORD"),
  database: System.get_env("DB_DATABASE"),
  hostname: System.get_env("DB_HOSTNAME"),
  show_sensitive_data_on_connection_error: true,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "6"),
  ssl: true

IO.puts("Config.exs - Secret test: #{System.get_env("DB_HOSTNAME")}")

secret_key_base =
  System.get_env("SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret or try running `source .env`
    """

# Configures the endpoint
config :react_phoenix, ReactPhoenixWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: secret_key_base,
  render_errors: [view: ReactPhoenixWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: ReactPhoenix.PubSub,
  live_view: [signing_salt: "HC1Fi55n"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs` like Postmark
config :react_phoenix, ReactPhoenix.Mailer, adapter: Swoosh.Adapters.Local

# config :react_phoenix, ReactPhoenix.Mailer,
#   adapter: Swoosh.Adapters.Postmark,
#   api_key: System.get_env("POSTMARK_API_KEY")

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, Swoosh.ApiClient.Hackney

config :ueberauth, Ueberauth,
  providers: [
    google: {ReactPhoenixWeb.Strategy.Google, [default_scope: "email profile"]}
  ]

config :ueberauth, ReactPhoenixWeb.Strategy.Google.OAuth,
  client_id: System.get_env("OAUTH_GOOGLE_CLIENT_ID"),
  client_secret: System.get_env("OAUTH_GOOGLE_CLIENT_SECRET")

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# config :react_phoenix,
#   openai_api: System.get_env("OPENAI_API_KEY")
# organization_key: "your-organization-key" # find it at https://beta.openai.com/account/api-keys

config :tesla, adapter: Tesla.Adapter.Hackney

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
