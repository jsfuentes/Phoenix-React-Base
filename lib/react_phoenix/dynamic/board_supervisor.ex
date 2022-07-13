defmodule ReactPhoenix.Dynamic.BoardSupervisor do
  use DynamicSupervisor
  require Logger

  alias ReactPhoenix.Dynamic.BoardGenServer

  def init(:ok) do
    Logger.info("Init BoardSupervisor")
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def start_link(_arg) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def get_board_state(board_id) do
    bpid = get_board_genserver(board_id)
    GenServer.call(bpid, :get_board_state)
  end

  # def create_update_event(event_id, event_params) do
  #   case event_id && Events.get_event(event_id) do
  #     %Event{} = _event ->
  #       Logger.warn("create_update_event update")
  #       {:ok, _} = update_event(event_id, event_params)

  #     # DB is serialized, so creations will happen in order without genserver
  #     nil ->
  #       Logger.warn("create_update_event create")
  #       Events.create_event(event_params)
  #   end
  # end

  # # Event_params can be both %{""} and %Event{}
  # def update_event(event_id, event_params) do
  #   epid = get_event_genserver(event_id)
  #   # Returns {:ok, ...} or {:error} from Repo update
  #   GenServer.call(epid, {:update_event, {event_id, event_params}}, 12000)
  # end

  # # Though no return, make call so blocking
  # def delete_event(event_id) do
  #   epid = get_event_genserver(event_id)
  #   GenServer.call(epid, :delete_event)
  # end

  defp get_board_genserver(board_id) do
    {:ok, bpid} = DynamicSupervisor.start_child(__MODULE__, {BoardGenServer, board_id})
    bpid
  end
end
