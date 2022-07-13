import { nanoid } from "nanoid";
import { axios } from "src/api/axios";
import { logAxiosError } from "src/redux/notification";
import { store } from "src/redux/store";

const BoardService = {
  createDefaultBoard,
};

export default BoardService;

interface CreateBoardResponse {
  data: Board;
}

async function createDefaultBoard(user_id: string) {
  try {
    const resp = await axios.post<CreateBoardResponse>("/api/boards", {
      board: {
        id: nanoid(),
        title: "Brainstorming Session",
        owner_id: user_id,
        activities: [
          {
            title: "Generate ideas",
            description:
              "Pick a problem or topic with your group and generate lots of ideas quickly. We recommend 8 ideas in 8 minutes. Sometimes to be truly creative, our brains need structure and rules. This tactic forces ideas out, fast.",
            type: "crazy8",
            order: 1,
          },
          {
            title: "View everyone’s ideas",
            description:
              "Pick a problem or topic with your group and generate lots of ideas quickly. We recommend 8 ideas in 8 minutes. Sometimes to be truly creative, our brains need structure and rules. This tactic forces ideas out, fast.",
            type: "gallery",
            order: 2,
          },
          {
            title: "Sort ideas by theme",
            description:
              "On the right, you can view everyone’s ideas. Go through them one at a time as a group and remove any duplicates and categorize them into themes.",
            type: "theme_sort",
            order: 3,
          },
          {
            title: "Vote on ideas anonymously",
            description:
              "Democratically make decisions as a group without being led by one individual. Blind voting neutralises dominating personailities or opinions in the decision making process.",
            type: "upvote",
            order: 4,
          },
          {
            title: "View voting results",
            description:
              "Democratically make decisions as a group without being led by one individual. Blind voting neutralises dominating personailities or opinions in the decision making process.",
            type: "vote_results",
            order: 5,
          },
        ],
      },
    });

    return resp.data.data;
  } catch (err) {
    store.dispatch(logAxiosError(err, "Creating board"));
    throw err;
  }
}
