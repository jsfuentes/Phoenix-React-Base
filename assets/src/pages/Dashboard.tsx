import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import PresenceList from "src/components/PresenceList";
import { useAppDispatch } from "src/redux/hooks";
import { updateSelf } from "src/redux/userStatus";
const debug = require("debug")("app:Dashboard");

export default function Dashboard() {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateSelf({ name }));
  }, [dispatch, name]);

  return (
    <>
      <Navbar>
        <Link to="/dashboard" className="font-medium mx-2">
          Dashboard
        </Link>
        <Link to="/login" className="font-medium mx-2">
          Login
        </Link>
      </Navbar>

      <div className="w-full p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl flex flex-row font-bold mb-4">
            <div className="bx bx-rocket animate-wiggle text-black mx-1" />{" "}
            Dashboard Page
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-400 my-2"
          />
          <PresenceList />
        </div>
      </div>
      <Footer />
    </>
  );
}
