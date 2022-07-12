defmodule ReactPhoenix.Repo.Migrations.CreateStickies do
  use Ecto.Migration

  def change do
    create table(:stickies) do
      add :title, :string
      add :description, :string
      add :image, :string
      add :user_id, references(:users, on_delete: :nilify_all, type: :string)
      add :board_id, references(:boards, on_delete: :delete_all, type: :string)

      timestamps()
    end

    create index(:stickies, [:user_id])
    create index(:stickies, [:board_id])
  end
end
