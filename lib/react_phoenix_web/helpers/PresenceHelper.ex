defmodule ReactPhoenixWeb.Helpers.PresenceHelper do
  alias ReactPhoenixWeb.Presence

  def getUsersWithStatus(socket_or_topic, desired_status = "group_idle") do
    getUsersWithMetaValues(socket_or_topic, %{"status" => desired_status})
  end

  def getUsersWithMetaValues(socket_or_topic, map) do
    Presence.list(socket_or_topic)
    |> Enum.filter(fn {_k, %{metas: metas}} ->
      curMeta = getCurrentMeta(metas)

      Enum.all?(map, fn {key, value} -> Map.get(curMeta, key) === value end)
    end)
    |> Enum.map(fn {k, %{metas: _metas}} -> k end)
  end

  def getMyCurrentMeta(socket) do
    %{metas: curMetas} = Presence.get_by_key(socket, socket.assigns.user_id)
    getCurrentMeta(curMetas)
  end

  def getCurrentMeta(metas) do
    Enum.reduce(metas, nil, fn new, acc ->
      if acc === nil do
        new
      else
        if new.online_at > acc.online_at, do: new, else: acc
      end
    end)
  end

  def update(socket, newMap) do
    now = inspect(System.system_time(:second))

    {:ok, _} =
      Presence.update(
        socket,
        socket.assigns.user_id,
        &(Map.merge(&1, newMap) |> Map.put(:online_at, now))
      )
  end
end
