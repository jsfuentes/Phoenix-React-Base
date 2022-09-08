defmodule ReactPhoenix.Boards do
  @moduledoc """
  The Boards context.
  """

  import Ecto.Query, warn: false
  alias ReactPhoenix.Repo

  alias ReactPhoenix.Boards.Board

  @doc """
  Returns the list of boards.

  ## Examples

      iex> list_boards()
      [%Board{}, ...]

  """
  def list_boards do
    Repo.all(Board)
  end

  def list_boards_by_user(user_id) do
    Repo.all(from b in Board, where: b.owner_id == ^user_id, order_by: [desc: b.updated_at])
  end

  @doc """
  Gets a single board.

  Raises `Ecto.NoResultsError` if the Board does not exist.

  ## Examples

      iex> get_board!(123)
      %Board{}

      iex> get_board!(456)
      ** (Ecto.NoResultsError)

  """
  def get_board!(id) do
    Repo.get!(Board, id)
    |> Repo.preload(:activities)
    |> Repo.preload(stickies: :user)
  end

  @doc """
  Creates a board.

  ## Examples

      iex> create_board(%{field: value})
      {:ok, %Board{}}

      iex> create_board(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_board(attrs \\ %{}) do
    %Board{}
    |> Board.changeset(attrs)
    |> Ecto.Changeset.cast_assoc(:activities,
      with: &ReactPhoenix.Activities.Activity.changeset/2
    )
    |> Repo.insert()
  end

  @doc """
  Updates a board.

  ## Examples

      iex> update_board(board, %{field: new_value})
      {:ok, %Board{}}

      iex> update_board(board, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_board(%Board{} = board, attrs) do
    board
    |> Board.changeset(attrs)
    |> Ecto.Changeset.cast_assoc(:activities,
      with: &ReactPhoenix.Activities.Activity.changeset/2
    )
    |> Repo.update()
  end

  def update_board_owner(original_owner_id, new_owner_id) do
    query = from(b in Board, where: b.owner_id == ^original_owner_id)

    Repo.update_all(query,
      set: [
        owner_id: new_owner_id
      ]
    )
  end

  @doc """
  Deletes a board.

  ## Examples

      iex> delete_board(board)
      {:ok, %Board{}}

      iex> delete_board(board)
      {:error, %Ecto.Changeset{}}

  """
  def delete_board(%Board{} = board) do
    Repo.delete(board)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking board changes.

  ## Examples

      iex> change_board(board)
      %Ecto.Changeset{data: %Board{}}

  """
  def change_board(%Board{} = board, attrs \\ %{}) do
    Board.changeset(board, attrs)
  end
end
