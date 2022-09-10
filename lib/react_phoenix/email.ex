defmodule ReactPhoenix.Email do
  import Swoosh.Email

  alias ReactPhoenix.Mailer

  require Logger

  # def rsvp(email, board_id, timezone \\ nil) do
  #   fields = fetch_event_fields(event_id, timezone)

  #   # if fields.send_rsvp_email do
  #   email_obj =
  #     new()
  #     |> from({fields.host_name, "hello@clayboard.com"})
  #     |> to(String.downcase(email))
  #     |> put_provider_option(:template_alias, "welcome")
  #     |> put_provider_option(:template_model, fields)
  #     |> attachment(invite_for(email, event_id))

  #   mailer_deliver(email_obj, "RSVP Email")
  # end

  def send_magic_link(email, params) do
    query_string = params |> Map.put(:route, "/dashboard") |> URI.encode_query() |> IO.inspect()
    link = "#{ReactPhoenixWeb.Endpoint.url()}/auth/magic_link_login?#{query_string}"

    send_magic_link_helper(email, %{link: link}, "pathspace-login-link")
  end

  def send_magic_link(email, params, board_id) do
    query_string = params |> Map.put(:route, "/b/#{board_id}") |> URI.encode_query()
    link = "#{ReactPhoenixWeb.Endpoint.url()}/auth/magic_link_login?#{query_string}"

    # fields = fetch_event_fields(event_id) |> Map.put(:link, link)
    # send_magic_link_helper(email, fields, "magic-login")
    send_magic_link_helper(email, %{id: board_id, link: link}, "magic-login")
  end

  defp send_magic_link_helper(email, fields, template_alias) do
    email_obj =
      new()
      |> from("founders@clayboard.com")
      |> to(String.downcase(email))
      |> put_provider_option(:template_alias, template_alias)
      |> put_provider_option(:template_model, fields)

    mailer_deliver(email_obj, "magic link email")
  end

  # def send_invitation_link(invitation, %{name: invite_sender_name}) do
  #   organization = Organizations.get_organization(invitation.organization_id)

  #   action_query_string =
  #     URI.encode_query(%{
  #       type: "invited",
  #       route: "/dashboard?new=1",
  #       email: invitation.email,
  #       invite_token: invitation.token
  #     })

  #   fields = %{
  #     invite_sender_name: invite_sender_name,
  #     invite_sender_organization_name: organization.host_name,
  #     action_url: "#{ReactPhoenixWeb.Endpoint.url()}/login?#{action_query_string}"
  #   }

  #   email_obj =
  #     new()
  #     |> from({fields.invite_sender_organization_name, "hello@clayboard.com"})
  #     |> to(String.downcase(invitation.email))
  #     |> put_provider_option(:template_alias, "user-invitation")
  #     |> put_provider_option(:template_model, fields)

  #   mailer_deliver(email_obj, "invitation email")
  # end

  # def send_reminder(email, board_id, timezone) do
  #   fields = fetch_event_fields(board_id, timezone)

  #   # if fields.send_reminder_email do
  #   email_obj =
  #     new()
  #     |> from({fields.host_name, "hello@clayboard.com"})
  #     |> to(String.downcase(email))
  #     |> put_provider_option(:template_alias, "reminder")
  #     |> put_provider_option(:template_model, fields)

  #   mailer_deliver(email_obj, "reminder email")
  # end

  defp mailer_deliver(email_obj, email_name) do
    case Mailer.deliver(email_obj) do
      {:ok, _} ->
        {:ok, nil}

      # {422, %{"ErrorCode" => 300, "Message" => "Invalid 'To' address: 'azanfally@gmail'."}}
      {:error, {422, %{"ErrorCode" => 300, "Message" => message}}} ->
        Logger.error("Failed to deliver #{email_name} 422",
          extra: %{message: message, email_obj: inspect(email_obj)}
        )

        {:error, message}

      # Unknown if this path is ever used, but assume above pattern continues
      {:error, {_, %{"Message" => message}} = error} ->
        Logger.error("Failed to deliver #{email_name}",
          extra: %{
            message: inspect(message),
            error: inspect(error),
            email_obj: inspect(email_obj)
          }
        )

        {:error, message}

      {:error, error} ->
        Logger.error("Failed to deliver #{email_name}",
          extra: %{
            error: inspect(error),
            email_obj: inspect(email_obj)
          }
        )

        {:error, nil}
    end
  end

  # defp fetch_event_fields(event_id, timezone \\ "America/Los_Angeles") do
  #   event = Events.get_event!(event_id)

  #   host_name = event.host_name || "Slingshow"

  #   # TODO: Add timezone data in rsvp api call
  #   start_time =
  #     event.start_time
  #     # Cant just use default parameter because nil argument doesn't trigger it
  #     |> Timex.to_datetime(timezone || "America/Los_Angeles")
  #     |> Timex.format!("{WDshort} {Mshort} {D}, {kitchen} {Zabbr}")

  #   now = DateTime.utc_now()
  #   # st - now in seconds so should be positive(assuming emails are sent about a future event)
  #   seconds_until = DateTime.diff(event.start_time, now)
  #   # div floors to integer
  #   minutes_until = Integer.to_string(div(seconds_until, 60))
  #   Logger.debug("Start time considered #{start_time} and minutes until #{minutes_until}")

  #   %{
  #     id: event.id,
  #     title: event.title,
  #     description: event.description,
  #     start_time: start_time,
  #     event_image: event.event_image,
  #     host_name: host_name,
  #     host_description: event.host_description,
  #     host_logo: event.host_logo,
  #     link: "#{ReactPhoenixWeb.Endpoint.url()}/e/#{event.id}",
  #     minutes_until: minutes_until,
  #     send_rsvp_email: Map.get(event.settings, "send_rsvp_email", true),
  #     send_reminder_email: Map.get(event.settings, "send_reminder_email", true)
  #   }
  # end

  # defp invite_for(email, event_id) do
  #   event = Events.get_event!(event_id)
  #   content = {:data, View.render_to_string(PageView, "invite.ics", event: event, email: email)}
  #   options = %{filename: "invite.ics", content_type: "text/plain", type: :inline}

  #   Swoosh.Attachment.new(content, options)
  # end
end
