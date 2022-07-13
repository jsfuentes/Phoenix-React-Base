defmodule ReactPhoenix.Stickies.Sticky do
  use Ecto.Schema
  import Ecto.Changeset

  schema "stickies" do
    field :title, :string
    field :description, :string
    field :image, :string
    belongs_to :user, ReactPhoenix.Accounts.User, type: :string
    belongs_to :board, ReactPhoenix.Boards.Board, type: :string

    many_to_many :sticky_groups, ReactPhoenix.Stickies.StickyGroup,
      join_through: ReactPhoenix.Stickies.StickyXGroup

    timestamps()
  end

  @doc false
  def changeset(sticky, attrs) do
    sticky
    |> cast(attrs, [:title, :description, :image, :user_id, :board_id])
    |> validate_required([:title, :user_id, :board_id])
  end
end
