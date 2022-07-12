defmodule ReactPhoenix.Repo.Migrations.CreateBoards do
  use Ecto.Migration

  def change do
    create table(:boards, primary_key: false) do
      add :id, :string, primary_key: true
      add :title, :string
      add :description, :string
      add :owner_id, references(:users, on_delete: :nothing, type: :string)

      timestamps()
    end

    create index(:boards, [:owner_id])
  end
end
