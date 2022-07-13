defmodule ReactPhoenixWeb.BoardView do
  use ReactPhoenixWeb, :view
  alias ReactPhoenixWeb.BoardView
  alias ReactPhoenixWeb.UserView

  def render("index.json", %{boards: boards}) do
    %{data: render_many(boards, BoardView, "board.json")}
  end

  def render("show.json", %{board: board}) do
    %{data: render_one(board, BoardView, "board.json")}
  end

  def render("board.json", %{board: board}) do
    sortedActivities =
      if Ecto.assoc_loaded?(board.activities),
        do: Enum.sort_by(board.activities, & &1.order),
        else: []

    sortedStickies =
      if Ecto.assoc_loaded?(board.stickies),
        do: Enum.sort_by(board.stickies, & &1.inserted_at),
        else: []

    %{
      id: board.id,
      title: board.title,
      description: board.description,
      owner_id: board.owner_id,
      inserted_at: board.inserted_at,
      updated_at: board.updated_at,
      activites: render_many(sortedActivities, BoardView, "activity.json", as: :activity),
      stickies: render_many(sortedStickies, BoardView, "sticky.json", as: :sticky)
    }
  end

  def render("activity.json", %{activity: activity}) do
    %{
      id: activity.id,
      title: activity.title,
      description: activity.description,
      type: activity.type,
      order: activity.order,
      inserted_at: activity.inserted_at,
      updated_at: activity.updated_at
    }
  end

  def render("sticky.json", %{sticky: sticky}) do
    %{
      id: sticky.id,
      title: sticky.title,
      description: sticky.description,
      image: sticky.image,
      user: render_one(sticky.user, UserView, "public.json", as: :user),
      user_id: sticky.user_id,
      inserted_at: sticky.inserted_at,
      updated_at: sticky.updated_at
    }
  end
end
