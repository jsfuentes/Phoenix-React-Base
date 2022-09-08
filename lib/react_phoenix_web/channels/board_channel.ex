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
    assignedSocket = assign(socket, :board_id, board_id)
    # TODO: Add better error handling here
    board_state = construct_board_state(board_id)
    send(self(), {:after_join, Map.get(payload, "userStatus")})
    {:ok, %{data: board_state}, assignedSocket}
  end

  @impl true
  def handle_info({:after_join, initial_status}, socket) do
    user_id = socket.assigns.user_id
    # board_id = socket.assigns.board_id

    # CREATE AND SEND PRESENCE
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
  def handle_in("board_diff", %{"type" => type, "payload" => payload}, socket) do
    user_id = socket.assigns.user_id
    board_id = socket.assigns.board_id

    # TODO: Instead of repushing entire board state just push the diff and have the client update its local state
    case type do
      "add_sticky" ->
        title = Map.get(payload, "title")

        cond do
          is_nil(title) ->
            Logger.error("Adding sticky without title")
            {:reply, {:error, %{reason: "Adding sticky without title"}}, socket}

          true ->
            {:ok, %Sticky{} = new_sticky} =
              Stickies.create_sticky(%{
                "board_id" => board_id,
                "user_id" => user_id,
                "title" => title,
                "description" => Map.get(payload, "description", nil),
                "sticky_groups" => Map.get(payload, "sticky_groups", [])
              })

            viewed_sticky =
              Phoenix.View.render_one(new_sticky, ReactPhoenixWeb.BoardView, "sticky.json",
                as: :sticky
              )

            Logger.warn("BOARD_DIFF: ADD_STICKY: " <> inspect(viewed_sticky))
            broadcast(socket, "board_diff", %{"type" => type, "payload" => viewed_sticky})

            {:reply, {:ok, viewed_sticky}, socket}
        end

      t ->
        Logger.error("Invalid board diff type: " <> t,
          extra: %{user_id: user_id, board_id: board_id}
        )

        {:reply, {:error, %{reason: "Invalid type of board update"}}, socket}
    end
  end

  @impl true
  def handle_in("get_board_state", _payload, socket) do
    # user_id = socket.assigns.user_id
    board_id = socket.assigns.board_id

    board_state = construct_board_state(board_id) |> IO.inspect()
    {:reply, {:ok, board_state}, socket}
  end

  # TODO: Add error handling to constructing board state
  def construct_board_state(board_id) do
    board = ReactPhoenix.Boards.get_board!(board_id)
    {:ok, %{schedule_state: schedule_state}} = BoardSupervisor.get_board_state(board_id)

    viewed_board =
      Phoenix.View.render_one(board, ReactPhoenixWeb.BoardView, "board.json", as: :board)

    Map.merge(viewed_board, %{schedule_state: schedule_state})
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
