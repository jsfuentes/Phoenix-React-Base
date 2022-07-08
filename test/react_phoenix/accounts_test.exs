defmodule ReactPhoenix.AccountsTest do
  use ReactPhoenix.DataCase

  alias ReactPhoenix.Accounts

  describe "users" do
    alias ReactPhoenix.Accounts.User

    import ReactPhoenix.AccountsFixtures

    @invalid_attrs %{email: nil, id: nil, name: nil, picture: nil, type: nil}

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Accounts.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Accounts.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      valid_attrs = %{email: "some email", id: "some id", name: "some name", picture: "some picture", type: "some type"}

      assert {:ok, %User{} = user} = Accounts.create_user(valid_attrs)
      assert user.email == "some email"
      assert user.id == "some id"
      assert user.name == "some name"
      assert user.picture == "some picture"
      assert user.type == "some type"
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(@invalid_attrs)
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      update_attrs = %{email: "some updated email", id: "some updated id", name: "some updated name", picture: "some updated picture", type: "some updated type"}

      assert {:ok, %User{} = user} = Accounts.update_user(user, update_attrs)
      assert user.email == "some updated email"
      assert user.id == "some updated id"
      assert user.name == "some updated name"
      assert user.picture == "some updated picture"
      assert user.type == "some updated type"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Accounts.update_user(user, @invalid_attrs)
      assert user == Accounts.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Accounts.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end
  end
end
