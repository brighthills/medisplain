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
    if (!file || !accessToken) {
      console.warn("Hiányzik a fájl vagy a token.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    console.log("Feltöltés indul:", file.name);
    console.log("Token:", accessToken);

    const res = await fetch("https://s3raie13tj.execute-api.eu-central-1.amazonaws.com/dev/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await res.text();

    if (res.ok) {
      alert("✅ Sikeres feltöltés!");
      console.log("Szerver válasz:", result);
    } else {
      alert("❌ Hiba a feltöltésnél.");
      console.error("Hibakód:", res.status);
      console.error("Hibaüzenet:", result);
    }
  };

  if (!accessToken) return <p>Bejelentkezés szükséges...</p>;

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Feltöltő oldal</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
