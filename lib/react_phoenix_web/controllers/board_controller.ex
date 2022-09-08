defmodule ReactPhoenixWeb.BoardController do
  use ReactPhoenixWeb, :controller
  require Logger

  alias ReactPhoenix.Boards
  alias ReactPhoenix.Boards.Board

  plug ReactPhoenixWeb.OwnsBoard
       when action in [
              :delete
            ]

  action_fallback ReactPhoenixWeb.FallbackController

  def index(conn, _params) do
    user_id = conn.assigns.current_user.id

    boards = Boards.list_boards_by_user(user_id)
    render(conn, "index.json", boards: boards)
  end

  def create(conn, %{"board" => board_params}) do
    with {:ok, %Board{} = board} <- Boards.create_board(board_params) do
      conn
      |> put_status(:created)
      |> render("show.json", board: board)
    end
  end

  # def show(conn, %{"id" => id}) do
  #   board = Boards.get_board!(id)
  #   render(conn, "show.json", board: board)
  # end

  # def update(conn, %{"id" => id, "board" => board_params}) do
  #   board = Boards.get_board!(id)

  #   with {:ok, %Board{} = board} <- Boards.update_board(board, board_params) do
  #     render(conn, "show.json", board: board)
  #   end
  # end

  def delete(conn, %{"id" => id}) do
    board = Boards.get_board!(id)

    with {:ok, %Board{}} <- Boards.delete_board(board) do
      Logger.warn("Deleted #{id}")
      send_resp(conn, :no_content, "")
    end
  end
end
