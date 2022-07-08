defmodule ReactPhoenix.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :string, primary_key: true
      add :email, :string
      add :name, :string
      add :picture, :string
      add :type, :string

      timestamps()
    end
  end
end
