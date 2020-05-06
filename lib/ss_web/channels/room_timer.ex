defmodule SsWeb.RoomTimer do
  use GenServer

  def start_link() do
    # runs in the caller context 🐌Alice
    GenServer.start_link(__MODULE__, [])
  end

  def init(_) do
    # runs in the server context 🐨Bob
    IO.puts("ININTING ROOM TIMER")
    {:ok, 1}
  end

  def handle_call(:get_data, _, state) do
    # runs in the server context 🐨Bob
    {:reply, state, state}
  end

  def handle_cast(:increment, state) do
    # runs in the server context 🐨Bob
    {:noreply, state+1}
  end
end