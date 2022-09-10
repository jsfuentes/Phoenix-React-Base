import Config

# For production, don't forget to configure the url host
# to something meaningful, Phoenix uses this information
# when generating URLs.
#
# Note we also include the path to a cache manifest
# containing the digested version of static files. This
# manifest is generated by the `mix phx.digest` task,
# which you should run after static files are built and
# before starting your production server.
config :react_phoenix, ReactPhoenixWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json"

# Do not print debug messages in production
config :logger, level: :info

# Configure your database
config :react_phoenix, ReactPhoenix.Repo,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "15")

host_url = System.get_env("HOST_URL")

if is_nil(host_url) or host_url == "" do
  IO.puts(
    "Environment variable HOST_URL is missing. If the server isn't working, this is probably the reason."
  )
end

# HOST_URL should be in form "app.pathspace.com" or "localhost:3000"
config :react_phoenix, ReactPhoenixWeb.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [scheme: "https", host: host_url, port: 443],
  # check_origin: [host_url], #might be needed for live dashboard
  # url: [scheme: "https", host: "pathspace.com", port: 443],
  cache_static_manifest: "priv/static/cache_manifest.json"

config :sentry,
  dsn: System.get_env("SENTRY_DSN_URL"),
  environment_name: :prod,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!(),
  tags: %{
    env: "production"
  },
  included_environments: [:prod]

config :logger, backends: [:console, Sentry.LoggerBackend]
# print all messages in prod

config :logger, :console,
  # format: {ReactPhoenix.Helpers.LogFormatter, :format},
  # format: "$time - $level$levelpad $metadata | $message\n",
  level: :debug

# sentry capture all error messages
config :logger,
       Sentry.LoggerBackend,
       # Send messages like `Logger.error("error")` to Sentry
       capture_log_messages: true,
       # Also send warn messages like `Logger.warn("warning")` to Sentry
       # level: :warn,
       # Do not exclude exceptions from Plug/Cowboy
       excluded_domains: [],
       # Include metadata added with `Logger.metadata([foo_bar: "value"])`
       metadata: [:request_id, :extra]

# ## SSL Support
#
# To get SSL working, you will need to add the `https` key
# to the previous section and set your `:url` port to 443:
#
#     config :react_phoenix, ReactPhoenixWeb.Endpoint,
#       ...,
#       url: [host: "example.com", port: 443],
#       https: [
#         ...,
#         port: 443,
#         cipher_suite: :strong,
#         keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
#         certfile: System.get_env("SOME_APP_SSL_CERT_PATH")
#       ]
#
# The `cipher_suite` is set to `:strong` to support only the
# latest and more secure SSL ciphers. This means old browsers
# and clients may not be supported. You can set it to
# `:compatible` for wider support.
#
# `:keyfile` and `:certfile` expect an absolute path to the key
# and cert in disk or a relative path inside priv, for example
# "priv/ssl/server.key". For all supported SSL configuration
# options, see https://hexdocs.pm/plug/Plug.SSL.html#configure/1
#
# We also recommend setting `force_ssl` in your endpoint, ensuring
# no data is ever sent via http, always redirecting to https:
#
#     config :react_phoenix, ReactPhoenixWeb.Endpoint,
#       force_ssl: [hsts: true]
#
# Check `Plug.SSL` for all available options in `force_ssl`.
