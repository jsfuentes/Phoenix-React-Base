defmodule ReactPhoenixWeb.BoardChannel do
  use ReactPhoenixWeb, :channel
  alias ReactPhoenixWeb.Presence
  require Logger

  alias ReactPhoenixWeb.Helpers.PresenceHelper
  alias ReactPhoenix.Stickies
  alias ReactPhoenix.Stickies.Sticky

  @impl true
  def join("board:" <> board_id, payload, socket) do
    user_id = socket.assigns.user_id
    pList = Presence.list(socket)

    if Map.has_key?(pList, user_id) do
      {:error, %{reason: "DUPLICATE_USER"}}
    else
      assignedSocket = assign(socket, :board_id, board_id)
      send(self(), {:after_join, Map.get(payload, "userStatus")})
      {:ok, :hello, assignedSocket}
    end
  end

  @impl true
  def handle_info({:after_join, initial_status}, socket) do
    user_id = socket.assigns.user_id

    # PRESENCE
    data =
      Map.merge(
        %{online_at: inspect(System.system_time(:second))},
        initial_status || %{}
      )

    {:ok, _} = Presence.track(socket, user_id, data)
    pList = Presence.list(socket)
    push(socket, "presence_state", pList)
    {:noreply, socket}
  end

  @impl true
  def handle_in("update_self", userStatus, socket) do
    PresenceHelper.update(socket, userStatus)

    {:reply, :ok, socket}
  end

  @impl true
  def handle_in("add_sticky", %{"title" => title} = payload, socket) do
    user_id = socket.assigns.user_id
    board_id = socket.assigns.board_id

    {:ok, %Sticky{}} =
      Stickies.create_sticky(%{
        "board_id" => board_id,
        "user_id" => user_id,
        "title" => title,
        "description" => Map.get(payload, "description", nil)
      })

    {:reply, :ok, socket}
  end

  # # Channels can be used in a request/response fashion
  # # by sending replies to requests from the client
  # @impl true
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (board:lobby).
  # @impl true
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end
end
