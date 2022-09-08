defmodule ReactPhoenix.Helpers.MyOpenAI do
  require Logger
  use Tesla

  plug Tesla.Middleware.BaseUrl, "https://api.openai.com"

  plug Tesla.Middleware.Headers, [
    {"Authorization", "Bearer #{Application.fetch_env!(:react_phoenix, :openai_api)}"},
    {"Content-type", "application/json"}
  ]

  plug Tesla.Middleware.Timeout, timeout: 5_000

  plug Tesla.Middleware.JSON

  @completions_url "/v1/engines"

  def brainstorm(prompt, ideas) do
    type = "davinci"
    max_tokens = 60
    temperature = 0.75

    idea_list =
      ideas
      |> Enum.with_index()
      |> Enum.map(fn {idea, i} ->
        "#{i + 1}. #{idea}\n"
      end)
      |> Enum.join("")

    full_prompt = "#{prompt}\n#{idea_list}#{Enum.count(ideas) + 1}." |> IO.inspect()

    {:ok, %Tesla.Env{status: 200, body: %{"choices" => choices} = _resp}} =
      post(url(type), %{prompt: full_prompt, max_tokens: max_tokens, temperature: temperature})

    # # "length"
    ended_early =
      choices
      |> List.first()
      |> Map.get("finish_reason") === "length"

    # TODO: Only take options that appear after numbers in the prompt
    # TODO: If is not complete and there is no bad data following it, then don't use the last number option
    text =
      choices
      |> List.first()
      |> Map.get("text")
      |> IO.inspect()

    ideas =
      text
      |> String.split("\n")
      # Get rid of incomplete lines
      |> (fn ideas ->
            if ended_early do
              {_last_idea, rest} = List.pop_at(ideas, -1)
              rest
            else
              ideas
            end
          end).()
      |> Enum.with_index()
      |> Enum.filter(fn {idea, i} ->
        # If either starts with a number. or is first answer
        i === 0 or String.match?(idea, ~r/^[0-9]+\./)
      end)
      |> Enum.map(fn {idea, _i} ->
        idea
        |> String.replace(~r/^[0-9]+\./, "")
        |> String.replace(~r/^\"/, "")
        |> String.replace(~r/\"$/, "")
        |> String.trim()
      end)
      |> Enum.filter(&(&1 != ""))
      |> MapSet.new()
      |> MapSet.to_list()
      |> IO.inspect()

    ideas
  end

  def categorize(prompt, ideas) do
    type = "davinci"
    max_tokens = 25
    temperature = 0.6

    idea_list =
      ideas
      |> Enum.with_index()
      |> Enum.map(fn {idea, i} ->
        "#{i + 1}. #{idea}\n"
      end)
      |> Enum.join("")

    full_prompt =
      "#{prompt}\n#{idea_list}\nTwo one word categories for the above ideas:\n1." |> IO.inspect()

    {:ok, %Tesla.Env{status: 200, body: %{"choices" => choices} = _resp}} =
      post(url(type), %{prompt: full_prompt, max_tokens: max_tokens, temperature: temperature})

    text =
      choices
      |> List.first()
      |> Map.get("text")
      |> IO.inspect()

    ended_early =
      choices
      |> List.first()
      |> Map.get("finish_reason") === "length"

    categories =
      text
      |> String.split("\n")
      # Get rid of incomplete lines
      |> (fn ideas ->
            if ended_early do
              {_last_idea, rest} = List.pop_at(ideas, -1)
              rest
            else
              ideas
            end
          end).()
      |> Enum.with_index()
      |> Enum.filter(fn {idea, i} ->
        # If either starts with a number. or is first answer
        i === 0 or String.match?(idea, ~r/^[0-9]+\./)
      end)
      |> Enum.map(fn {idea, _i} ->
        idea
        |> String.replace(~r/^[0-9]+\./, "")
        |> String.replace(~r/^\"/, "")
        |> String.replace(~r/\"$/, "")
        |> String.trim()
      end)
      |> IO.inspect()
      |> Enum.filter(fn i -> i != "" end)
      |> Enum.take(2)
      |> IO.inspect()

    if Enum.count(categories) != 2 do
      ["Category 1", "Category 2"]
    else
      categories
    end
  end

  def test() do
    brainstorm("What should I do in the next month?", [
      "Silent retreat for 7 days with no input or output",
      "Create life planning framework"
    ])
  end

  def url(engine) do
    "#{@completions_url}/#{engine}/completions"
  end
end
