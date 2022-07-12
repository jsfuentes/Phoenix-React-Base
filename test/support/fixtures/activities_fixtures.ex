defmodule ReactPhoenix.ActivitiesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `ReactPhoenix.Activities` context.
  """

  @doc """
  Generate a activity.
  """
  def activity_fixture(attrs \\ %{}) do
    {:ok, activity} =
      attrs
      |> Enum.into(%{
        description: "some description",
        order: 42,
        title: "some title",
        type: "some type"
      })
      |> ReactPhoenix.Activities.create_activity()

    activity
  end
end
