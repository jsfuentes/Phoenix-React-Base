defmodule ReactPhoenixWeb.OwnsBoard do
  import Plug.Conn
  import Phoenix.Controller
  require Logger

  alias ReactPhoenix.Boards

  def init(opts), do: opts

  def call(
        conn = %{
          assigns: %{current_user: current_user},
          params: %{"id" => id}
        },
        _opts
      ) do
    board = Boards.get_board!(id)

    if(board.owner_id == current_user.id) do
      conn
    else
      conn
      |> put_status(401)
      |> text("Unauthorized")
      |> halt()
    end
  end

  def call(conn, _opts) do
    conn
    |> put_status(401)
    |> text("Unauthorized")
    |> halt()
  end
end
