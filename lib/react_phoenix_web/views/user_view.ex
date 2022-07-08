defmodule ReactPhoenixWeb.UserView do
  use ReactPhoenixWeb, :view
  alias ReactPhoenixWeb.UserView
  alias ReactPhoenix.Accounts

  def render("index.json", %{users: users}) do
    %{data: render_many(users, UserView, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      type: user.type,
      socket_token: Accounts.generate_socket_token(user)
    }
  end
end
