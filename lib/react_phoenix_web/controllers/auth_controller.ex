defmodule ReactPhoenixWeb.AuthController do
  use ReactPhoenixWeb, :controller
  require Logger

  plug Ueberauth
  alias ReactPhoenix.Accounts
  alias ReactPhoenix.Accounts.User
  # alias ReactPhoenix.Organizations
  # alias ReactPhoenix.Organizations.Invitation
  # alias Ueberauth.Strategy.Helpers

  action_fallback ReactPhoenixWeb.ApiFallbackController

  @default_redirect_route "/dashboard"

  # On failure, still redirect to the routes with a flash
  def request(conn, _params) do
    conn
    |> put_status(404)
    |> text("Not Found")
  end

  def callback(%{assigns: %{ueberauth_failure: fails}} = conn, _params) do
    Logger.error("Failed uberauth #{inspect(fails)}")

    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    Logger.debug("Got uberauth #{inspect(auth)}")
    auth_id = get_session(conn, :auth_id) || Nanoid.generate(12)

    with {:ok, %User{} = user} <- Accounts.get_create_ueberauth_user(auth.info, auth_id) do
      conn
      |> put_session(:user_id, user.id)
      |> assign(:current_user, user)
      |> after_auth_redirect()
    else
      _ ->
        conn
        |> put_flash(
          :error,
          "Server failed to create user, please try again or contact support"
        )
        |> redirect(to: "/")
    end
  end

  def google_login(conn, %{"gaccess_token" => gaccess_token} = params) do
    auth_id = Map.get(params, "id") || get_session(conn, :auth_id) || Nanoid.generate(12)

    with {:ok, %User{} = user} <- Accounts.get_create_google_user(gaccess_token, auth_id) do
      Logger.info("Get/Create Google user: #{inspect(user)}")

      conn
      |> put_session(:user_id, user.id)
      |> assign(:current_user, user)
      |> after_auth_redirect()
    else
      _ ->
        conn
        |> put_flash(
          :error,
          "Server failed to create user from google login, please try again or contact support"
        )
        |> redirect(to: "/")
    end
  end

  def magic_token_login(conn, %{"route" => route, "magic_token" => magic_token} = params) do
    # Copied in api_controller on_auth
    conn =
      conn
      |> put_session(:auth_id, Map.get(params, "id"))
      |> put_session(:auth_route, Map.get(params, "route"))
      |> put_session(:auth_invite_token, Map.get(params, "invite_token"))
      |> put_session(:when_organizer_route, Map.get(params, "when_organizer_route"))

    case Accounts.get_verify_token_user(magic_token) do
      {:ok, user} ->
        Logger.info("Get/Create Magiclink user: #{inspect(user)}")

        conn
        |> put_session(:user_id, user.id)
        |> assign(:current_user, user)
        |> after_auth_redirect()

      {:error, "expired"} ->
        Logger.error("Magic token failed because expired",
          extra: %{token: inspect(magic_token)}
        )

        conn
        |> put_flash(
          :error,
          "Login through this magic link is expired, try requesting a new one"
        )
        |> redirect(to: route || @default_redirect_route)

      {:error, reason} ->
        Logger.error("Magic token failed because #{reason}",
          extra: %{
            token: inspect(magic_token),
            reason: inspect(reason)
          }
        )

        conn
        |> put_flash(
          :error,
          "Server failed to create user from magic link, please try again or contact support"
        )
        |> redirect(to: route || @default_redirect_route)
    end
  end

  def magic_token_login(conn, _params) do
    conn |> put_status(404) |> text("Not Found")
  end

  def after_auth_redirect(%{assigns: %{current_user: %{type: user_type, id: user_id}}} = conn) do
    invite_token = get_session(conn, :auth_invite_token)

    # If the user is anon then signs in to claim board, we need to transfer the board ownership to the new id
    # I think this may technically allow anyone to steal boards. TODO: fetch the original user id server side instead of in param
    prev_user_id = get_session(conn, :auth_id)

    if prev_user_id && prev_user_id != user_id do
      Logger.debug(
        "Switching board ownership of user #{inspect(prev_user_id)} to #{inspect(user_id)}"
      )

      ReactPhoenix.Boards.update_board_owner(prev_user_id, user_id)
      ReactPhoenix.Stickies.update_sticky_owner(prev_user_id, user_id)
    else
      Logger.debug("Logged in user #{inspect(user_id)} is new. Not switching boards")
    end

    route =
      if user_type === "organizer" and get_session(conn, "when_organizer_route"),
        do: get_session(conn, "when_organizer_route"),
        else: get_session(conn, :auth_route) || @default_redirect_route

    conn =
      conn
      # refresh auth so doesn't always go to the same place
      |> delete_session(:auth_id)
      |> delete_session(:auth_route)
      |> delete_session(:auth_invite_token)
      |> delete_session(:when_organizer_route)

    Logger.warn("Auth path #{route} token #{invite_token}")

    # if invite_token do
    #   verify_invitation(conn, %{"invite_token" => invite_token, "route" => route})
    # else
    redirect(conn, to: route)
    # end
  end

  # def verify_invitation(%{assigns: %{current_user: current_user}} = conn, %{
  #       "invite_token" => invite_token,
  #       "route" => route
  #     }) do
  #   i = Organizations.get_invitation_by_token(invite_token)
  #   Logger.warn("INVITATION #{inspect(i)}")

  #   case i do
  #     %Invitation{status: "sent"} = invitation ->
  #       {:ok, _invitation} = Organizations.update_invitation(invitation, %{status: "used"})

  #       attrs = %{
  #         type: "organizer",
  #         organization_id: invitation.organization_id
  #       }

  #       with {:ok, %User{} = _user} <- Accounts.update_user(current_user, attrs) do
  #         redirect(conn, to: route)
  #       end

  #     %Invitation{status: "revoked"} ->
  #       conn
  #       |> put_flash(
  #         :error,
  #         "This invitation has been revoked, contact the organization adminstrator to send you another invitation"
  #       )
  #       |> redirect(to: "/")

  #     %Invitation{status: "used"} ->
  #       conn
  #       |> put_flash(
  #         :error,
  #         "This invitation has already been used to join the organization, contact the organization adminstrator to send you a new invitation"
  #       )
  #       |> redirect(to: "/")

  #     nil ->
  #       Logger.error("Verifying invitation of unknown token value",
  #         extra: %{it: inspect(invite_token)}
  #       )

  #       conn
  #       |> put_flash(
  #         :error,
  #         "Verifying this invitation failed, contact your organization try again or contact support or your organization adminstrator"
  #       )
  #       |> redirect(to: "/")
  #   end
  # end
end
