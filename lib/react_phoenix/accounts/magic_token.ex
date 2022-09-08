defmodule ReactPhoenix.Accounts.MagicToken do
  use Ecto.Schema
  import Ecto.Changeset

  schema "magic_tokens" do
    field :value, :string
    belongs_to :user, ReactPhoenix.Accounts.User, type: :string

    timestamps()
  end

  @doc false
  def changeset(magic_token, attrs) do
    magic_token
    |> cast(attrs, [:value, :user_id])
    |> validate_required([:value, :user_id])
  end
end
