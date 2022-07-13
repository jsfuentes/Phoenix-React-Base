defmodule ReactPhoenix.Dynamic.BoardGenServer do
  use GenServer, restart: :transient
  require Logger

  alias ReactPhoenixWeb.Endpoint
  alias ReactPhoenix.Boards

  # @default_board_state %{is_open: true}

  # State is %{subevent_id: %{key: timer}, event_id: event_id, event_}
  def start_link(event_id) do
    name = {:via, Registry, {Registry.BoardGenServer, event_id}}

    # wrap in :ok as start_link is expected to return this, it seems to be ok to return the pid to the supervisor if it already supervises it
    case GenServer.start_link(__MODULE__, event_id, name: name) do
      {:ok, pid} ->
        Logger.warn("BGEN start_link #{inspect(event_id)}")
        {:ok, pid}

      {:error, {:already_started, pid}} ->
        Logger.warn("BGEN already_started #{inspect(event_id)}")
        {:ok, pid}

      x ->
        Logger.error("BGEN Error", extra: %{err: inspect(x)})
        x
    end
  end

  def init(board_id) do
    Logger.info("BGEN #{board_id} - init")
    send(self(), :setup)
    {:ok, %{board_id: board_id}}
  end

  def handle_info(:setup, %{board_id: board_id}) do
    Logger.info("BGEN #{board_id} - setup")

    board = Boards.get_board!(board_id)
    first_activity_id = board.activities |> List.first() |> Map.get(:id, nil)
    now = DateTime.utc_now() |> DateTime.to_iso8601()

    state = %{
      board_id: board_id,
      board_state: %{
        schedule_state: %{"activity_id" => first_activity_id, "activity_start_time" => now}
      }
    }

    {:noreply, state}
  end

  def handle_call(:get_board_state, _from, state) do
    Logger.warn("BGEN - get_board_state")
    board_state = Map.get(state, :board_state)

    if is_nil(board_state) do
      Logger.error("No board state in get board state", extra: %{state: state})
      {:stop, "No board state in get board state", state}
    end

    {:reply, {:ok, board_state}, state}
  end

  # def handle_call({:update_event, {event_id, new_event}}, _from, state) do
  #   Logger.warn("BGEN handle_call update_event #{inspect(new_event)}")
  #   old_event = Events.get_event!(event_id, true)

  #   with {:ok, %Event{} = event} <- Events.update_event(old_event, new_event) do
  #     GroupManager.push_event_updates(old_event, event)
  #     {:reply, {:ok, event}, state}
  #   else
  #     # Hopefully this handles when new_event is invalid

  #     err ->
  #       IO.inspect(err)
  #       {:reply, err, state}
  #   end
  # end

  # def handle_call(:delete_event, _from, %{event_id: event_id} = state) do
  #   Logger.warn("BGEN delete_event #{event_id}")
  #   ReactPhoenixWeb.Endpoint.broadcast("event:#{event_id}", "delete_event", %{})

  #   Events.get_event!(event_id)
  #   |> Events.delete_event()

  #   {:stop, :normal, :ok, state}
  # end
end
