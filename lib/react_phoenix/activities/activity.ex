defmodule ReactPhoenix.Activities.Activity do
  use Ecto.Schema
  import Ecto.Changeset

  schema "activities" do
    field :title, :string
    field :description, :string
    field :type, :string
    field :order, :integer
    belongs_to :board, ReactPhoenix.Boards.Board, type: :string

    timestamps()
  end

  @doc false
  def changeset(activity, attrs) do
    activity
    |> cast(attrs, [:order, :title, :description, :type, :board_id])
    |> validate_required([:order, :title, :type])
  end
end
