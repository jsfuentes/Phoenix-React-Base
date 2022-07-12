defmodule ReactPhoenix.Boards.Board do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, []}
  schema "boards" do
    field :description, :string
    field :title, :string
    belongs_to :owner, ReactPhoenix.Accounts.User, type: :string
    has_many :activities, ReactPhoenix.Activities.Activity
    has_many :stickies, ReactPhoenix.Stickies.Sticky

    timestamps()
  end

  @doc false
  def changeset(board, attrs) do
    board
    |> cast(attrs, [:id, :title, :description, :owner_id])
    |> validate_required([:id, :title, :owner_id])
  end
end
