defmodule ReactPhoenixWeb.ApiFallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use ReactPhoenixWeb, :controller
  require Logger

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    Logger.error("ApiFallbackController unprocessable", extra: %{changeset: inspect(changeset)})

    conn
    |> put_status(:unprocessable_entity)
    |> put_view(ReactPhoenixWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
  end

  def call(conn, {:error, :not_found}) do
    Logger.warn("ApiFallbackController not_found")

    conn
    |> put_status(:not_found)
    |> put_view(ReactPhoenixWeb.ErrorView)
    |> render(:"404")
  end

  def call(_conn, x) do
    Logger.error("ApiFallbackController unrecognized return", extra: %{x: x})
    x
  end

  # def call(conn, {:error, {:bad_request, msg}}) do
  #   conn
  #   |> put_status(:bad_request)
  #   |> put_view
  # end
end
