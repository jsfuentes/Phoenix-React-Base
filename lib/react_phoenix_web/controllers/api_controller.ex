defmodule ReactPhoenixWeb.ApiController do
  use ReactPhoenixWeb, :controller
  require Logger

  action_fallback ReactPhoenixWeb.ApiFallbackController

  plug ReactPhoenixWeb.LoggedIn when action in [:link_preview]

  def index(conn, _params) do
    conn
    |> put_status(200)
    |> text("OK")
  end

  def error(conn, _params) do
    Logger.error("TESTING ERROR SENTRY", extra: %{a: "help", b: 1})

    try do
      raise "This Will Error, Really ?"
    rescue
      my_exception ->
        IO.inspect(my_exception)

        Sentry.capture_exception(my_exception,
          stacktrace: __STACKTRACE__,
          extra: %{extra: "Welcome"}
        )
    end
  end

  def not_found(conn, _params) do
    conn
    |> put_status(404)
    |> text("")
  end

  def on_auth(conn, params) do
    # Put session train copied in auth_controller for magic link login
    conn
    |> put_session(:auth_id, Map.get(params, "id"))
    |> put_session(:auth_route, Map.get(params, "route"))
    |> put_session(:auth_invite_token, Map.get(params, "invite_token"))
    |> put_session(:when_organizer_route, Map.get(params, "when_organizer_route"))
    |> send_resp(:no_content, "")
  end
end
