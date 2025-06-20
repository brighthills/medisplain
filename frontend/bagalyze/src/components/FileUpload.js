import React, { useEffect, useState } from "react";
import { redirectToLogin } from "../auth";

export default function FileUpload() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      redirectToLogin();
    } else {
      setAccessToken(token);
    }
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !accessToken) return;

    // Ellenőrzés: csak PDF engedélyezett
    if (file.type !== "application/pdf") {
      alert("❌ Csak PDF fájlokat lehet feltölteni.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(",")[1]; // csak a base64 tartalom

      const res = await fetch("https://xfi5ufezgc.execute-api.eu-central-1.amazonaws.com/dev/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ image_base64: base64 }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Sikeres feltöltés!");
        console.log("Szerver válasz:", result);
      } else {
        alert("❌ Hiba a feltöltésnél.");
        console.error("Hibakód:", res.status);
        console.error("Hibaüzenet:", result);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!accessToken) return <p>Login required...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>PDF feltöltés</h2>
      <input type="file" accept="application/pdf" onChange={handleUpload} />
    </div>
  );
}
