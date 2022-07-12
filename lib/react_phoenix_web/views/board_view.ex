defmodule ReactPhoenixWeb.BoardView do
  use ReactPhoenixWeb, :view
  alias ReactPhoenixWeb.BoardView

  def render("index.json", %{boards: boards}) do
    %{data: render_many(boards, BoardView, "board.json")}
  end

  def render("show.json", %{board: board}) do
    %{data: render_one(board, BoardView, "board.json")}
  end

  def render("board.json", %{board: board}) do
    %{
      id: board.id,
      title: board.title,
      description: board.description,
      owner_id: board.owner_id,
      inserted_at: board.inserted_at,
      updated_at: board.updated_at
    }
  end
end
