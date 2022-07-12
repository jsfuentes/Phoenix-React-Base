import React, { useMemo, useState } from "react";
import TempBoardContext from "./TempBoardContext";

interface TempBoardContextProviderProps {
  children: React.ReactNode;
}

const activities: Activity[] = [
  {
    title: "Generate Ideas",
    description: "Generate ideas for your board",
    type: "crazy8",
    stickies: [
      {
        id: 1,
        text: "This is sticky 1",
        user_id: 1,
      },
      {
        id: 2,
        text: "This is sticky 2",
        user_id: 2,
      },
      {
        id: 3,
        text: "This is sticky 3",
        user_id: 1,
      },
    ],
    activity_groups: [
      {
        user_id: 1,
        title: "Thomas",
        sticky_ids: [1, 3],
      },
      {
        user_id: 1,
        title: "Jorge",
        sticky_ids: [2],
      },
    ],
  },
  {
    title: "Sticky Sort",
    description: "Sort your board",
    type: "theme_sort",
    stickies: [
      {
        id: 1,
        text: "This is sticky 1",
        user_id: 1,
      },
      {
        id: 2,
        text: "This is sticky 2",
        user_id: 2,
      },
      {
        id: 3,
        text: "This is sticky 3",
        user_id: 1,
      },
    ],
    activity_groups: [
      {
        title: "Category 1",
        sticky_ids: [1],
      },
      {
        title: "Category 2",
        sticky_ids: [2, 3],
      },
    ],
  },
];

// fake data generator
const getItems = (count: any, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

export default function TempBoardContextProvider(
  props: TempBoardContextProviderProps
) {
  const [curActivityIdx, setCurActivityIdx] = useState(1);

  const value = useMemo(() => {
    return {
      user_id: 1,
      activities: activities,
      current_activity: activities[curActivityIdx],
    };
  }, []);

  return (
    <TempBoardContext.Provider value={value}>
      {props.children}
    </TempBoardContext.Provider>
  );
}
