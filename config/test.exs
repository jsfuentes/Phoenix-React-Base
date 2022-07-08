import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :react_phoenix, ReactPhoenix.Repo,
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  database: "react_phoenix_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :react_phoenix, ReactPhoenixWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "FW98suYBlrJTXLl6KtXcxP8wLliqu97uNwYjS64XVIxK8yhW+m8vAnAiujfChD8G",
  server: false

# In test we don't send emails.
config :react_phoenix, ReactPhoenix.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
