defmodule ReactPhoenixWeb.Router do
  use ReactPhoenixWeb, :router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug :fetch_session
    plug ReactPhoenixWeb.Auth
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/phoenix_dashboard", metrics: ReactPhoenixWeb.Telemetry
    end
  end

  scope "/auth", ReactPhoenixWeb do
    pipe_through :browser

    get "/google_login", AuthController, :google_login
    get "/magic_link_login", AuthController, :magic_token_login
    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    post "/:provider/callback", AuthController, :callback
  end

  # Other scopes may use custom stacks.
  scope "/api", ReactPhoenixWeb do
    pipe_through :api

    get "/", ApiController, :index
    post "/join", ApiController, :join
    post "/on_auth", ApiController, :on_auth
    post "/users/me", UserController, :me
    post "/users/logout", UserController, :logout
    post "/users/magic_link", UserController, :send_magic_link
    resources "/users", UserController, except: [:new, :edit, :index, :delete]
    resources "/boards", BoardController, except: [:new, :edit, :index, :delete]
  end

  scope "/", ReactPhoenixWeb do
    pipe_through :browser

    get "/*path", PageController, :index
  end
end
