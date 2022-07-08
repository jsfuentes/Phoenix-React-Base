defmodule ReactPhoenixWeb.UserChannel do
  use ReactPhoenixWeb, :channel

  @impl true
  def join("user:" <> user_id, payload, socket) do
    if authorized?(payload) do
      version = System.get_env("RELEASE_VSN")
      Logger.debug("User #{user_id} joined myChannel on v#{version}")

      # (Code.ensure_compiled?(Mix.Project) && Mix.Project.config() |> Enum.find(fn {key, _val} -> key === :version end))
      {:ok, %{version: version}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (user:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast(socket, "shout", payload)
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
