defmodule ReactPhoenixWeb.Auth do
  import Plug.Conn

  # alias ReactPhoenixWeb.Router.Helpers

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)
    # Jorge Admin Account
    # user_id = if Mix.env() == :dev, do: "pxFzScLfPYRO", else: user_id
    user = user_id && ReactPhoenix.Accounts.get_user(user_id)

    if user do
      Sentry.Context.set_user_context(user)
      Logger.metadata(user_id: user_id)
    end

    assign(conn, :current_user, user)
  end
end
