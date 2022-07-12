defmodule ReactPhoenix.StickiesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ReactPhoenix.Stickies` context.
  """

  @doc """
  Generate a sticky.
  """
  def sticky_fixture(attrs \\ %{}) do
    {:ok, sticky} =
      attrs
      |> Enum.into(%{
        description: "some description",
        image: "some image",
        title: "some title"
      })
      |> ReactPhoenix.Stickies.create_sticky()

    sticky
  end
end
