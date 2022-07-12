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
      },
    });

    return resp.data.data;
  } catch (err) {
    store.dispatch(logAxiosError(err, "Creating board"));
    throw err;
  }
}
