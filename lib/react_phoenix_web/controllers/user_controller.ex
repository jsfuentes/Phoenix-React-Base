defmodule ReactPhoenixWeb.UserController do
  use ReactPhoenixWeb, :controller
  require Logger

  alias ReactPhoenix.Accounts
  alias ReactPhoenix.Accounts.User

  action_fallback ReactPhoenixWeb.FallbackController

  # def index(conn, _params) do
  #   id = Accounts.list_id()
  #   render(conn, "index.json", id: id)
  # end

  def create(conn, %{"user" => %{"id" => id, "type" => "anon"}}) do
    attrs = %{id: id, type: "anon"}

    with {:ok, %User{} = user} <- Accounts.get_create_anon_user(attrs) do
      Logger.info("Get/Create Anon user: #{inspect(user)}")

      conn
      |> put_status(:created)
      |> put_session(:user_id, user.id)
      |> render("show.json", user: user)
    end
  end

  # def show(conn, %{"id" => id}) do
  #   user = Accounts.get_user!(id)
  #   render(conn, "show.json", user: user)
  # end

  def update(%{assigns: %{current_user: %{id: user_id} = current_user}} = conn, %{
        "id" => id,
        "user" => user_params
      }) do
    if user_id === id do
      with {:ok, %User{} = user} <- Accounts.update_user(current_user, user_params) do
        render(conn, "show.json", user: user)
      end
    else
      conn
      |> put_status(401)
      |> text("Unauthorized")
    end
  end

  # def delete(conn, %{"id" => id}) do
  #   user = Accounts.get_user!(id)

  #   with {:ok, %User{}} <- Accounts.delete_user(user) do
  #     send_resp(conn, :no_content, "")
  #   end
  # end

  # cookie session -> client given id. If client id taken, create new id and return and set session
  def me(conn, %{"user" => %{"id" => _id, "type" => _type}} = params) do
    user = conn.assigns.current_user

    if user do
      render(conn, "show.json", user: user)
    else
      create(conn, params)
    end
  end

  def logout(conn, _params) do
    conn
    |> configure_session(drop: true)
    |> send_resp(:no_content, "")
  end
end
