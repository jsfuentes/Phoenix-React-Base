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

  @doc """
  Generate a sticky_group.
  """
  def sticky_group_fixture(attrs \\ %{}) do
    {:ok, sticky_group} =
      attrs
      |> Enum.into(%{
        color: "some color",
        title: "some title"
      })
      |> ReactPhoenix.Stickies.create_sticky_group()

    sticky_group
  end

  @doc """
  Generate a sticky_x_group.
  """
  def sticky_x_group_fixture(attrs \\ %{}) do
    {:ok, sticky_x_group} =
      attrs
      |> Enum.into(%{})
      |> ReactPhoenix.Stickies.create_sticky_x_group()

    sticky_x_group
  end
end
