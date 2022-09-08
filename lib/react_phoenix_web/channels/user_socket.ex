defmodule ReactPhoenixWeb.UserSocket do
  use Phoenix.Socket
  require Logger

  # A Socket handler
  #
  # It's possible to control the websocket connection and
  # assign values that can be accessed by your channel topics.

  alias ReactPhoenix.Accounts

  ## Channels
  channel "user:*", ReactPhoenixWeb.UserChannel
  channel "board:*", ReactPhoenixWeb.BoardChannel

  @impl true
  def connect(%{"token" => token}, socket, _connect_info) do
    # Token is added to any user's "show.json"
    case Accounts.verify_socket_token(token) do
      {:ok, user_id} ->
        user = ReactPhoenix.Accounts.get_user!(user_id)
        Sentry.Context.set_user_context(user)

        new_socket =
          socket
          |> assign(:user_id, user_id)
          |> assign(:current_user, user)

        # TODO: Assuming this works, remove all calls within the socket channel to get user and replace with just accessing socket here
        {:ok, new_socket}

      {:error, reason} ->
        Logger.warn("Verify socket #{inspect(reason)}",
          extra: %{token: inspect(token), reason: inspect(reason)}
        )

        :error
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     Elixir.ReactPhoenixWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  @impl true
  def id(_socket), do: nil
end
