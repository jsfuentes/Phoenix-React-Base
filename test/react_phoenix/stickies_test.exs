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

  describe "sticky_groups" do
    alias ReactPhoenix.Stickies.StickyGroup

    import ReactPhoenix.StickiesFixtures

    @invalid_attrs %{color: nil, title: nil}

    test "list_sticky_groups/0 returns all sticky_groups" do
      sticky_group = sticky_group_fixture()
      assert Stickies.list_sticky_groups() == [sticky_group]
    end

    test "get_sticky_group!/1 returns the sticky_group with given id" do
      sticky_group = sticky_group_fixture()
      assert Stickies.get_sticky_group!(sticky_group.id) == sticky_group
    end

    test "create_sticky_group/1 with valid data creates a sticky_group" do
      valid_attrs = %{color: "some color", title: "some title"}

      assert {:ok, %StickyGroup{} = sticky_group} = Stickies.create_sticky_group(valid_attrs)
      assert sticky_group.color == "some color"
      assert sticky_group.title == "some title"
    end

    test "create_sticky_group/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Stickies.create_sticky_group(@invalid_attrs)
    end

    test "update_sticky_group/2 with valid data updates the sticky_group" do
      sticky_group = sticky_group_fixture()
      update_attrs = %{color: "some updated color", title: "some updated title"}

      assert {:ok, %StickyGroup{} = sticky_group} = Stickies.update_sticky_group(sticky_group, update_attrs)
      assert sticky_group.color == "some updated color"
      assert sticky_group.title == "some updated title"
    end

    test "update_sticky_group/2 with invalid data returns error changeset" do
      sticky_group = sticky_group_fixture()
      assert {:error, %Ecto.Changeset{}} = Stickies.update_sticky_group(sticky_group, @invalid_attrs)
      assert sticky_group == Stickies.get_sticky_group!(sticky_group.id)
    end

    test "delete_sticky_group/1 deletes the sticky_group" do
      sticky_group = sticky_group_fixture()
      assert {:ok, %StickyGroup{}} = Stickies.delete_sticky_group(sticky_group)
      assert_raise Ecto.NoResultsError, fn -> Stickies.get_sticky_group!(sticky_group.id) end
    end

    test "change_sticky_group/1 returns a sticky_group changeset" do
      sticky_group = sticky_group_fixture()
      assert %Ecto.Changeset{} = Stickies.change_sticky_group(sticky_group)
    end
  end

  describe "stickies_x_groups" do
    alias ReactPhoenix.Stickies.StickyXGroup

    import ReactPhoenix.StickiesFixtures

    @invalid_attrs %{}

    test "list_stickies_x_groups/0 returns all stickies_x_groups" do
      sticky_x_group = sticky_x_group_fixture()
      assert Stickies.list_stickies_x_groups() == [sticky_x_group]
    end

    test "get_sticky_x_group!/1 returns the sticky_x_group with given id" do
      sticky_x_group = sticky_x_group_fixture()
      assert Stickies.get_sticky_x_group!(sticky_x_group.id) == sticky_x_group
    end

    test "create_sticky_x_group/1 with valid data creates a sticky_x_group" do
      valid_attrs = %{}

      assert {:ok, %StickyXGroup{} = sticky_x_group} = Stickies.create_sticky_x_group(valid_attrs)
    end

    test "create_sticky_x_group/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Stickies.create_sticky_x_group(@invalid_attrs)
    end

    test "update_sticky_x_group/2 with valid data updates the sticky_x_group" do
      sticky_x_group = sticky_x_group_fixture()
      update_attrs = %{}

      assert {:ok, %StickyXGroup{} = sticky_x_group} = Stickies.update_sticky_x_group(sticky_x_group, update_attrs)
    end

    test "update_sticky_x_group/2 with invalid data returns error changeset" do
      sticky_x_group = sticky_x_group_fixture()
      assert {:error, %Ecto.Changeset{}} = Stickies.update_sticky_x_group(sticky_x_group, @invalid_attrs)
      assert sticky_x_group == Stickies.get_sticky_x_group!(sticky_x_group.id)
    end

    test "delete_sticky_x_group/1 deletes the sticky_x_group" do
      sticky_x_group = sticky_x_group_fixture()
      assert {:ok, %StickyXGroup{}} = Stickies.delete_sticky_x_group(sticky_x_group)
      assert_raise Ecto.NoResultsError, fn -> Stickies.get_sticky_x_group!(sticky_x_group.id) end
    end

    test "change_sticky_x_group/1 returns a sticky_x_group changeset" do
      sticky_x_group = sticky_x_group_fixture()
      assert %Ecto.Changeset{} = Stickies.change_sticky_x_group(sticky_x_group)
    end
  end
end
