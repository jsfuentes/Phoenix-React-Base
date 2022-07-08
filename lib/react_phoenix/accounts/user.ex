defmodule ReactPhoenix.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :string, []}
  schema "users" do
    field :email, :string
    field :name, :string
    field :picture, :string
    field :type, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:id, :email, :name, :picture, :type])
    |> validate_required([:id, :type])
  end
end
