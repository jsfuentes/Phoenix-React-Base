defmodule ReactPhoenix.Repo.Migrations.CreateMagicTokens do
  use Ecto.Migration

  def change do
    create table(:magic_tokens) do
      add :value, :text
      add :user_id, references(:users, on_delete: :delete_all, type: :string)

      timestamps()
    end

    create index(:magic_tokens, [:user_id])
    create unique_index(:magic_tokens, [:value])
  end
end
