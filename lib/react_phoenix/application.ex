defmodule ReactPhoenix.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      ReactPhoenix.Repo,
      # Start the Telemetry supervisor
      ReactPhoenixWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: ReactPhoenix.PubSub},
      # Start the Endpoint (http/https)
      ReactPhoenixWeb.Endpoint,
      ReactPhoenixWeb.Presence
      # Start a worker by calling: ReactPhoenix.Worker.start_link(arg)
      # {ReactPhoenix.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: ReactPhoenix.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    ReactPhoenixWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
