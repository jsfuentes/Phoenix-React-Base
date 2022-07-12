defmodule ReactPhoenix.StickiesTest do
  use ReactPhoenix.DataCase

  alias ReactPhoenix.Stickies

  describe "stickies" do
    alias ReactPhoenix.Stickies.Sticky

    import ReactPhoenix.StickiesFixtures

    @invalid_attrs %{description: nil, image: nil, title: nil}

    test "list_stickies/0 returns all stickies" do
      sticky = sticky_fixture()
      assert Stickies.list_stickies() == [sticky]
    end

    test "get_sticky!/1 returns the sticky with given id" do
      sticky = sticky_fixture()
      assert Stickies.get_sticky!(sticky.id) == sticky
    end

    test "create_sticky/1 with valid data creates a sticky" do
      valid_attrs = %{description: "some description", image: "some image", title: "some title"}

      assert {:ok, %Sticky{} = sticky} = Stickies.create_sticky(valid_attrs)
      assert sticky.description == "some description"
      assert sticky.image == "some image"
      assert sticky.title == "some title"
    end

    test "create_sticky/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Stickies.create_sticky(@invalid_attrs)
    end

    test "update_sticky/2 with valid data updates the sticky" do
      sticky = sticky_fixture()
      update_attrs = %{description: "some updated description", image: "some updated image", title: "some updated title"}

      assert {:ok, %Sticky{} = sticky} = Stickies.update_sticky(sticky, update_attrs)
      assert sticky.description == "some updated description"
      assert sticky.image == "some updated image"
      assert sticky.title == "some updated title"
    end

    test "update_sticky/2 with invalid data returns error changeset" do
      sticky = sticky_fixture()
      assert {:error, %Ecto.Changeset{}} = Stickies.update_sticky(sticky, @invalid_attrs)
      assert sticky == Stickies.get_sticky!(sticky.id)
    end

    test "delete_sticky/1 deletes the sticky" do
      sticky = sticky_fixture()
      assert {:ok, %Sticky{}} = Stickies.delete_sticky(sticky)
      assert_raise Ecto.NoResultsError, fn -> Stickies.get_sticky!(sticky.id) end
    end

    test "change_sticky/1 returns a sticky changeset" do
      sticky = sticky_fixture()
      assert %Ecto.Changeset{} = Stickies.change_sticky(sticky)
    end
  end
end
