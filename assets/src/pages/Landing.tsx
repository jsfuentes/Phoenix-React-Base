import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { axios } from "src/api/axios";
import Button from "src/components/Button";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
const debug = require("debug")("app:Landing");

export default function Landing() {
  const [resp, setResp] = useState("");
  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        debug("Landing Page response", response);
        setResp(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar>
        <Link to="/login" className="navlink">
          Login
        </Link>
      </Navbar>

      <div className="w-full p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl flex flex-row font-bold mb-4">
            <div className="bx bx-rocket animate-wiggle text-black mx-1" />{" "}
            Welcome to React Base BB
          </div>
          <Button onClick={() => toast.warn("Alert it up in herrrreee")}>
            Useless Button
          </Button>
          <div className="text-2xl font-bold my-4">
            {resp ? `The Server Says "${resp}"` : "The Server Can't Be Reached"}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
