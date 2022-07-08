import { useEffect } from "react";
import { useAppSelector } from "src/redux/hooks";
const debug = require("debug")("app:components:Presence");

export default function PresenceList() {
  const attendeesById = useAppSelector(
    (state) => state.presence.attendees.byId
  );
  const attendeesAllIds = useAppSelector(
    (state) => state.presence.attendees.allIds
  );

  useEffect(() => {
    debug("attendeesById", attendeesById, attendeesAllIds);
  }, [attendeesById, attendeesAllIds]);

  const pListUI = Object.values(attendeesById).map((at, i) => {
    return (
      <div
        key={at.id}
        className="p-4 border-solid border-black border-2 flex flex-col"
      >
        <div className="font-medium text-xl mb-2"> User {i + 1} </div>
        <div>{at.id}</div>
        <div>{at.name}</div>
        <div>{at.email}</div>
        <div>{at.picture}</div>
        <div>{at.status}</div>
        <div>{at.type}</div>
      </div>
    );
  });

  return <div className="flex flex-row">{pListUI}</div>;
}
