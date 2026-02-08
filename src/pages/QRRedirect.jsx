import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function QRRedirect() {
  const { publicToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const go = async () => {
      try {
        const res = await fetch(
          `/.netlify/functions/generateTemp?token=${publicToken}`
        );

        const data = await res.json();

        if (res.ok && data.tempToken) {
          navigate(`/resident/temp/${data.tempToken}`, { replace: true });
        } else {
          alert(data.message || "This QR code is not valid.");
        }
      } catch {
        alert("Could not open page. Please contact staff.");
      }
    };

    go();
  }, [publicToken, navigate]);

  return (
    <p style={{ textAlign: "center", marginTop: "2rem" }}>
      Opening private memory page…
    </p>
  );
}
