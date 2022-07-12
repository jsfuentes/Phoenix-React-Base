defmodule ReactPhoenix.Stickies do
  @moduledoc """
  The Stickies context.
  """

  import Ecto.Query, warn: false
  alias ReactPhoenix.Repo

  alias ReactPhoenix.Stickies.Sticky

  @doc """
  Returns the list of stickies.

  ## Examples

      iex> list_stickies()
      [%Sticky{}, ...]

  """
  def list_stickies do
    Repo.all(Sticky)
  end

  @doc """
  Gets a single sticky.

  Raises `Ecto.NoResultsError` if the Sticky does not exist.

  ## Examples

      iex> get_sticky!(123)
      %Sticky{}

      iex> get_sticky!(456)
      ** (Ecto.NoResultsError)

  """
  def get_sticky!(id), do: Repo.get!(Sticky, id)

  @doc """
  Creates a sticky.

  ## Examples

      iex> create_sticky(%{field: value})
      {:ok, %Sticky{}}

      iex> create_sticky(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_sticky(attrs \\ %{}) do
    %Sticky{}
    |> Sticky.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a sticky.

  ## Examples

      iex> update_sticky(sticky, %{field: new_value})
      {:ok, %Sticky{}}

      iex> update_sticky(sticky, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_sticky(%Sticky{} = sticky, attrs) do
    sticky
    |> Sticky.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a sticky.

  ## Examples

      iex> delete_sticky(sticky)
      {:ok, %Sticky{}}

      iex> delete_sticky(sticky)
      {:error, %Ecto.Changeset{}}

  """
  def delete_sticky(%Sticky{} = sticky) do
    Repo.delete(sticky)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking sticky changes.

  ## Examples

      iex> change_sticky(sticky)
      %Ecto.Changeset{data: %Sticky{}}

  """
  def change_sticky(%Sticky{} = sticky, attrs \\ %{}) do
    Sticky.changeset(sticky, attrs)
  end
end
