defmodule ReactPhoenix.Repo.Migrations.CreateActivities do
  use Ecto.Migration

  def change do
    create table(:activities) do
      add :order, :integer
      add :title, :string
      add :description, :text
      add :type, :string
      add :board_id, references(:boards, on_delete: :delete_all, type: :string)

      timestamps()
    end

    create index(:activities, [:board_id])
  end
end
