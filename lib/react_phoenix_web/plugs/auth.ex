defmodule ReactPhoenixWeb.Auth do
  import Plug.Conn

  # alias ReactPhoenixWeb.Router.Helpers

  def init(opts), do: opts

  def call(conn, _opts) do
    user_id = get_session(conn, :user_id)
    # BRIAN T
    # user_id = if Mix.env() == :dev, do: "edahxnACCSbW", else: user_id
    # REVOPS
    # user_id = if Mix.env() == :dev, do: "LFYQ3dInsyPq", else: user_id
    # HASHTAG
    # user_id = if Mix.env() == :dev, do: "YuAfqY8mgtux", else: user_id
    # INSURED NOMADS
    # user_id = if Mix.env() == :dev, do: "sWjqoBKDZZYf", else: user_id
    # SHIMMER
    # user_id = if Mix.env() == :dev, do: "ZsEWMprw52fp", else: user_id
    # ALLVOICES
    # user_id = if Mix.env() == :dev, do: "gid4HitHH4Ow", else: user_id
    # ARMORY
    # user_id = if Mix.env() == :dev, do: "czRWMEDDnnLf", else: user_id
    # Lawyerist
    # user_id = if Mix.env() == :dev, do: "V9rIaBM0V9gM", else: user_id
    # Venture Out
    # user_id = if Mix.env() == :dev, do: "6KWAKGp87xRK", else: user_id
    # NILAY
    # user_id = if Mix.env() == :dev, do: "pxFzScLfPYRO", else: user_id
    # 3DS
    # user_id = if Mix.env() == :dev, do: "t-dXD5jOkZxN", else: user_id
    # Alec, destroyer of worlds
    # user_id = if Mix.env() == :dev, do: "-m137OnlMzZ6", else: user_id
    # user_id = if Mix.env() == :dev, do: "42XXXvjfxzDs", else: user_id
    user = user_id && ReactPhoenix.Accounts.get_user(user_id)

    if user do
      Sentry.Context.set_user_context(user)
      Logger.metadata(user_id: user_id)
    end

    assign(conn, :current_user, user)
  end
end
