defmodule ReactPhoenix.Stickies.StickyGroup do
  use Ecto.Schema
  import Ecto.Changeset

  schema "sticky_groups" do
    field :color, :string
    field :title, :string
    belongs_to :activity, ReactPhoenix.Activities.Activity

    many_to_many :stickies, ReactPhoenix.Stickies.Sticky,
      join_through: ReactPhoenix.Stickies.StickyXGroup

    timestamps()
  end

  @doc false
  def changeset(sticky_group, attrs) do
    sticky_group
    |> cast(attrs, [:title, :color, :activity_id])
    |> validate_required([:title, :color, :activity_id])
  end
end
