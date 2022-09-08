defmodule ReactPhoenix.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias ReactPhoenix.Repo
  require Logger

  alias ReactPhoenix.Accounts.User
  alias ReactPhoenix.Accounts.MagicToken
  @token_secret_key "AXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  @token_socket_salt "CHANGE THIS TO ANYTHING YOU WANT"
  @token_magiclink_salt "CHANGE THIS TO ANYTHING YOU WANT2"
  # 30 minutes
  @token_max_age 1_800
  # This will cause errors if someone keeps the page open, so make two weeks and expect componentreload to handle these edge cases
  @token_socket_max_age 1_209_600
  # TODO: Fix the errors that will happen if someone keeps the page open. Not a big deal because pushes should cause reloads

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)
  def get_user(id), do: Repo.get(User, id)

  def get_create_google_user(gaccess_token, id) do
    url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=" <> gaccess_token
    {:ok, %Tesla.Env{status: 200, body: body}} = Tesla.get(url) |> IO.inspect()
    profile = Jason.decode!(body)

    attrs = %{
      name: profile["name"],
      picture: profile["picture"],
      email: profile["email"],
      gid: profile["id"],
      gaccess_token: gaccess_token,
      locale: profile["locale"]
    }

    get_create_verified_user(attrs, id)
  end

  def get_create_ueberauth_user(%{email: email} = ueberauth, id) do
    attrs = %{
      name: Map.get(ueberauth, :name) || ueberauth.first_name <> " " <> ueberauth.last_name,
      email: email,
      picture: ueberauth.image
    }

    get_create_verified_user(attrs, id)
  end

  # update_nil_fields means name and picture will only be set if its null
  def get_create_magiclink_user(email, token_user) do
    name = token_user.name || String.split(email, "@") |> List.first()
    attrs = %{email: email, name: name, picture: token_user.picture}
    get_create_verified_user(attrs, token_user.id)
  end

  # attrs shouldn't have id
  def get_create_verified_user(%{email: email} = attrs, id) do
    cleaned_email = String.downcase(email)

    case Repo.get_by(User, email: cleaned_email) do
      %User{} = user ->
        Logger.debug("Updating nil fields of existing registered #{email} #{user.id}")

        # notice we don't change type letting organziers be set in db, and only update nil fields when user already exists so like pics dont get overriden
        update_user_nil_fields(user, attrs)

      nil ->
        # if nanoid already taken(user(same local id) logs in with another email) by a verified user, then create new nanoid
        case Repo.get_by(User, id: id) do
          %User{} = user ->
            if user.type === "anon" do
              Logger.debug("Upgrading existing anon user #{user.id}")
              expanded_attrs = attrs |> Map.put(:type, "registered")
              update_user(user, expanded_attrs)
            else
              Logger.debug("Id #{id} taken, creating new user_id")

              expanded_attrs =
                attrs |> Map.put(:id, Nanoid.generate(12)) |> Map.put(:type, "registered")

              create_user(expanded_attrs)
            end

          nil ->
            Logger.debug("Creating new user with client id")
            expanded_attrs = attrs |> Map.put(:id, id) |> Map.put(:type, "registered")
            create_user(expanded_attrs)
        end
    end
  end

  def get_create_anon_user(%{id: id, type: "anon"} = attrs) do
    case Repo.get(User, id) do
      %User{} = user ->
        # IO.inspect(user)
        # create new id and create that user
        if user.type === "anon" do
          Logger.debug("Returning existing anon user")
          update_user(user, attrs)
        else
          Logger.debug("Id copied, generate new id")
          # Tiny chance for double collision(more if someone edits local storage)
          attrs = Map.put(attrs, :id, Nanoid.generate())
          create_user(attrs)
        end

      nil ->
        Logger.debug("Create user with given id")
        create_user(attrs)
    end
  end

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def update_user_nil_fields(%User{} = user, attrs) do
    reduced_attrs =
      attrs
      |> Enum.map(fn {k, v} ->
        if Map.get(user, k) === nil do
          {k, v}
        end
      end)
      |> Enum.filter(fn x -> !is_nil(x) end)
      |> Enum.into(%{})

    update_user(user, reduced_attrs)
  end

  @doc """
  Deletes a user.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{data: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  def generate_socket_token(user) do
    token = Phoenix.Token.sign(ReactPhoenixWeb.Endpoint, @token_socket_salt, user.id)
    Logger.warn("Generated token #{inspect(token)} for user #{inspect(user.id)}")
    token
  end

  # This is here to use all the global variables, but returns the same as a verify
  def verify_socket_token(token) do
    Phoenix.Token.verify(ReactPhoenixWeb.Endpoint, @token_socket_salt, token,
      max_age: @token_socket_max_age
    )
  end

  @doc """
  Returns the list of magic_tokens.

  ## Examples

      iex> list_magic_tokens()
      [%MagicToken{}, ...]

  """
  def list_magic_tokens do
    Repo.all(MagicToken)
  end

  @doc """

  Return user corresponding to magic token email

  ## Examples

      iex> verify_token_value("jlasdvjioqjipofjwfjqwi")
      {:ok, %User{}}

      iex> verify_token_value()
      {:error, :empty}

  """
  def get_verify_token_user(value) do
    Repo.one(from mt in MagicToken, where: mt.value == ^value)
    |> Repo.preload(:user)
    |> verify_token
  end

  defp verify_token(nil), do: {:error, :empty}

  # Loads the user and deletes the token as it is now used once.
  defp verify_token(token) do
    token =
      token
      |> Repo.preload(:user)
      |> IO.inspect()

    # |> Repo.delete!() add back if single use

    # verify the token matching the user id
    case Phoenix.Token.verify(@token_secret_key, @token_magiclink_salt, token.value,
           max_age: @token_max_age
         ) do
      # returns {:ok, %User{} = user}
      {:ok, email} ->
        get_create_magiclink_user(email, token.user)

      # reason can be :invalid or :expired
      {:error, reason} ->
        Logger.error("Token verify fail because #{reason}",
          extra: %{token: inspect(token), reason: inspect(reason)}
        )

        {:error, reason}
    end
  end

  @doc """
  Gets a single magic_token.

  Raises `Ecto.NoResultsError` if the Magic token does not exist.

  ## Examples

      iex> get_magic_token!(123)
      %MagicToken{}

      iex> get_magic_token!(456)
      ** (Ecto.NoResultsError)

  """
  def get_magic_token!(id), do: Repo.get!(MagicToken, id)

  def generate_magic_token(user, email) do
    attrs = %{
      user_id: user.id,
      value: Phoenix.Token.sign(@token_secret_key, @token_magiclink_salt, email)
    }

    auth_token =
      %MagicToken{}
      |> MagicToken.changeset(attrs)
      |> Repo.insert!()

    auth_token.value
  end

  @doc """
  Updates a magic_token.

  ## Examples

      iex> update_magic_token(magic_token, %{field: new_value})
      {:ok, %MagicToken{}}

      iex> update_magic_token(magic_token, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_magic_token(%MagicToken{} = magic_token, attrs) do
    magic_token
    |> MagicToken.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a magic_token.

  ## Examples

      iex> delete_magic_token(magic_token)
      {:ok, %MagicToken{}}

      iex> delete_magic_token(magic_token)
      {:error, %Ecto.Changeset{}}

  """
  def delete_magic_token(%MagicToken{} = magic_token) do
    Repo.delete(magic_token)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking magic_token changes.

  ## Examples

      iex> change_magic_token(magic_token)
      %Ecto.Changeset{data: %MagicToken{}}

  """
  def change_magic_token(%MagicToken{} = magic_token, attrs \\ %{}) do
    MagicToken.changeset(magic_token, attrs)
  end
end
