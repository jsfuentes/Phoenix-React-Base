interface CreateStickyBoardDiff {
  type: "add_sticky";
  payload: Sticky;
}

interface UpdateStickyBoardDiff {
  type: "update_sticky";
  payload: Sticky;
}

type BoardDiff = CreateStickyBoardDiff | UpdateStickyBoardDiff;
