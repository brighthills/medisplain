import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../auth";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      exchangeCodeForToken(code)
        .then((data) => {
          localStorage.setItem("accessToken", data.access_token);
          navigate("/"); // vissza a főoldalra
        })
        .catch((err) => {
          console.error("Token error", err);
          alert("Bejelentkezés sikertelen.");
        });
    }
  }, [navigate]);

  return <p>Bejelentkezés folyamatban...</p>;
}
