defmodule ReactPhoenix.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ReactPhoenix.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        email: "some email",
        id: "some id",
        name: "some name",
        picture: "some picture",
        type: "some type"
      })
      |> ReactPhoenix.Accounts.create_user()

    user
  end
end
