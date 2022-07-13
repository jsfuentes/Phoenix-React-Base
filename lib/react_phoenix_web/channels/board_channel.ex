defmodule ReactPhoenixWeb.BoardChannel do
  use ReactPhoenixWeb, :channel
  alias ReactPhoenixWeb.Presence
  require Logger

  alias ReactPhoenixWeb.Helpers.PresenceHelper
  alias ReactPhoenix.Stickies
  alias ReactPhoenix.Stickies.Sticky
  alias ReactPhoenix.Dynamic.BoardSupervisor

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
    board_id = socket.assigns.board_id

    # CREATE AND SEND PRESENCE
    data =
      Map.merge(
        %{online_at: inspect(System.system_time(:second))},
        initial_status || %{}
      )

    {:ok, _} = Presence.track(socket, user_id, data)
    pList = Presence.list(socket)
    push(socket, "presence_state", pList)

    # CREATE AND SEND BOARD STATE
    board_state = construct_board_state(board_id) |> IO.inspect()
    push(socket, "board_state", board_state)
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

  @impl true
  def handle_in("get_board_state", _payload, socket) do
    user_id = socket.assigns.user_id
    board_id = socket.assigns.board_id

    board_state = construct_board_state(board_id) |> IO.inspect()
    {:reply, {:ok, board_state}, socket}
  end

  def construct_board_state(board_id) do
    board = ReactPhoenix.Boards.get_board!(board_id)
    {:ok, %{schedule_state: schedule_state}} = BoardSupervisor.get_board_state(board_id)

    viewed_board =
      Phoenix.View.render_one(board, ReactPhoenixWeb.BoardView, "board.json", as: :board)

    Map.merge(viewed_board, %{schedule_state: schedule_state})
  end

  # TODO: One day, all messages should be in redux form and sent as payloads to backend which 1) updates db and 2) sends to all clients

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
