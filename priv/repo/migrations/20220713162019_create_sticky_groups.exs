defmodule ReactPhoenix.Repo.Migrations.CreateStickyGroups do
  use Ecto.Migration

  def change do
    create table(:sticky_groups) do
      add :title, :string
      add :color, :string
      add :activity_id, references(:activities, on_delete: :nilify_all)

      timestamps()
    end

    create index(:sticky_groups, [:activity_id])
  end
end
