defmodule ReactPhoenix.Stickies.StickyXGroup do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key false
  schema "stickies_x_groups" do
    field :sticky_id, :id
    field :sticky_group_id, :id

    # timestamps()
  end

  @doc false
  def changeset(sticky_x_group, attrs) do
    sticky_x_group
    |> cast(attrs, [])
    |> validate_required([])
  end
end
