defmodule ReactPhoenix.Repo.Migrations.CreateStickiesXGroups do
  use Ecto.Migration

  def change do
    create table(:stickies_x_groups, primary_key: false) do
      add :sticky_id, references(:stickies, on_delete: :delete_all)
      add :sticky_group_id, references(:sticky_groups, on_delete: :delete_all)

      # timestamps()
    end

    create index(:stickies_x_groups, [:sticky_id])
    create index(:stickies_x_groups, [:sticky_group_id])
  end
end
