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

  alias ReactPhoenix.Stickies.StickyGroup

  @doc """
  Returns the list of sticky_groups.

  ## Examples

      iex> list_sticky_groups()
      [%StickyGroup{}, ...]

  """
  def list_sticky_groups do
    Repo.all(StickyGroup)
  end

  @doc """
  Gets a single sticky_group.

  Raises `Ecto.NoResultsError` if the Sticky group does not exist.

  ## Examples

      iex> get_sticky_group!(123)
      %StickyGroup{}

      iex> get_sticky_group!(456)
      ** (Ecto.NoResultsError)

  """
  def get_sticky_group!(id), do: Repo.get!(StickyGroup, id)

  @doc """
  Creates a sticky_group.

  ## Examples

      iex> create_sticky_group(%{field: value})
      {:ok, %StickyGroup{}}

      iex> create_sticky_group(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_sticky_group(attrs \\ %{}) do
    %StickyGroup{}
    |> StickyGroup.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a sticky_group.

  ## Examples

      iex> update_sticky_group(sticky_group, %{field: new_value})
      {:ok, %StickyGroup{}}

      iex> update_sticky_group(sticky_group, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_sticky_group(%StickyGroup{} = sticky_group, attrs) do
    sticky_group
    |> StickyGroup.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a sticky_group.

  ## Examples

      iex> delete_sticky_group(sticky_group)
      {:ok, %StickyGroup{}}

      iex> delete_sticky_group(sticky_group)
      {:error, %Ecto.Changeset{}}

  """
  def delete_sticky_group(%StickyGroup{} = sticky_group) do
    Repo.delete(sticky_group)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking sticky_group changes.

  ## Examples

      iex> change_sticky_group(sticky_group)
      %Ecto.Changeset{data: %StickyGroup{}}

  """
  def change_sticky_group(%StickyGroup{} = sticky_group, attrs \\ %{}) do
    StickyGroup.changeset(sticky_group, attrs)
  end

  alias ReactPhoenix.Stickies.StickyXGroup

  @doc """
  Returns the list of stickies_x_groups.

  ## Examples

      iex> list_stickies_x_groups()
      [%StickyXGroup{}, ...]

  """
  def list_stickies_x_groups do
    Repo.all(StickyXGroup)
  end

  @doc """
  Gets a single sticky_x_group.

  Raises `Ecto.NoResultsError` if the Sticky x group does not exist.

  ## Examples

      iex> get_sticky_x_group!(123)
      %StickyXGroup{}

      iex> get_sticky_x_group!(456)
      ** (Ecto.NoResultsError)

  """
  def get_sticky_x_group!(id), do: Repo.get!(StickyXGroup, id)

  @doc """
  Creates a sticky_x_group.

  ## Examples

      iex> create_sticky_x_group(%{field: value})
      {:ok, %StickyXGroup{}}

      iex> create_sticky_x_group(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_sticky_x_group(attrs \\ %{}) do
    %StickyXGroup{}
    |> StickyXGroup.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a sticky_x_group.

  ## Examples

      iex> update_sticky_x_group(sticky_x_group, %{field: new_value})
      {:ok, %StickyXGroup{}}

      iex> update_sticky_x_group(sticky_x_group, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_sticky_x_group(%StickyXGroup{} = sticky_x_group, attrs) do
    sticky_x_group
    |> StickyXGroup.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a sticky_x_group.

  ## Examples

      iex> delete_sticky_x_group(sticky_x_group)
      {:ok, %StickyXGroup{}}

      iex> delete_sticky_x_group(sticky_x_group)
      {:error, %Ecto.Changeset{}}

  """
  def delete_sticky_x_group(%StickyXGroup{} = sticky_x_group) do
    Repo.delete(sticky_x_group)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking sticky_x_group changes.

  ## Examples

      iex> change_sticky_x_group(sticky_x_group)
      %Ecto.Changeset{data: %StickyXGroup{}}

  """
  def change_sticky_x_group(%StickyXGroup{} = sticky_x_group, attrs \\ %{}) do
    StickyXGroup.changeset(sticky_x_group, attrs)
  end
end
