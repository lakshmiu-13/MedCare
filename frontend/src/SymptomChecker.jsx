// SymptomChecker.jsx (safe version)
import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./SymptomChecker.css";

function SymptomChecker() {
  const location = useLocation();
  const navigate = useNavigate();
  const { age: ageFromHome, sex: sexFromHome } = location.state || {};

  const [input, setInput] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState(ageFromHome ?? "");
  const [sex, setSex] = useState(sexFromHome ?? "any");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!ageFromHome) setAge(""); // keep blank if not passed
  if (!sexFromHome) setSex("any");
}, [ageFromHome, sexFromHome]);


  const handleCheck = async () => {
    setError("");
    setResult(null);

    if (!input.trim()) {
      setError("Please enter a symptom or disease name.");
      return;
    }
    if (age === "" || age === null) {
      setError("Please enter your age (or go back to Home and provide it).");
      return;
    }
    if (!sex) {
      setError("Please select sex.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          age: Number(age),
          sex: String(sex),
          duration: Number(duration || 0),
        }),
      });

      const data = await res.json();
      console.log("API /check response:", data); // <-- inspect what backend returned

      // If backend returned an error status, show the message
      if (!res.ok) {
        const msg = data?.error || data?.message || "No matching record found.";
        setError(msg);
        setLoading(false);
        return;
      }

      // If backend returned a plain message (not full disease record), show it as error/info
      if (data && (data.message || data.error) && !data.diseaseName) {
        setError(data.message || data.error);
        setLoading(false);
        return;
      }

      // At this point we expect a disease record. If not present, show generic error.
      if (!data || !data.diseaseName) {
        setError("Unexpected response from server. Check console for details.");
        setLoading(false);
        return;
      }

      // Good record — set it
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Server error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-page">
      <nav className="sc-nav">
        <div className="sc-logo">💊 MedCare</div>
        <div className="sc-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
         
        </div>
      </nav>

      <main className="sc-main">
        <h1 className="sc-title">Symptom / Disease Checker</h1>

        <div className="sc-form">
          <div className="form-row">
            <label>Symptom or Disease</label>
            <input
              placeholder="e.g., fever, cough, headache"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="form-row small-row">
            <div>
              <label>Duration (days)</label>
              <input
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label>Age</label>
              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
              />
            </div>
            <div>
              <label>Sex</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="any">Select / Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={handleCheck}
              disabled={loading}
            >
              {loading ? "Checking..." : "Check"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setInput("");
                setDuration("");
                setResult(null);
                setError("");
              }}
            >
              Reset
            </button>
          </div>

          {error && <div className="sc-error">{error}</div>}
        </div>

        {result && (
          <section className="sc-result">
            {/* Safe, defensive rendering of suitability */}
            {result.suitability === false && (
              <div className="sc-warning">
                ⚠️ Results may not be suitable for your age/sex.
                <div className="small">
                  (minAge OK:{" "}
                  {String(result?.suitabilityReasons?.minAgeOk ?? "N/A")},
                  maxAge OK:{" "}
                  {String(result?.suitabilityReasons?.maxAgeOk ?? "N/A")},
                  gender OK:{" "}
                  {String(result?.suitabilityReasons?.genderOk ?? "N/A")})
                </div>
              </div>
            )}

            {result.extraNote && (
              <div className="sc-extranote">{result.extraNote}</div>
            )}

            <h2 className="disease-title">{result.diseaseName}</h2>

            <h3>Medicines</h3>
            <div className="med-grid">
              {Array.isArray(result.medicines) &&
              result.medicines.length > 0 ? (
                result.medicines.map((med, idx) => (
                  <div className="med-card" key={idx}>
                    <div className="med-image-wrap">
                      <img
                        src={med.image || ""}
                        alt={med.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3Eno image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="med-info">
                      <h4>{med.name}</h4>
                      <p>{med.shortInfo}</p>

                      <div className="med-actions">
                        <button
                          className="btn-primary small"
                          onClick={() =>
                            navigate(
                              `/medicine/${encodeURIComponent(med.name)}`
                            )
                          }
                        >
                          View Full Info
                        </button>
                        <button
                          className="btn-secondary small"
                          onClick={() =>
                            alert(
                              "Remember: this is informational only. Consult a doctor for prescriptions."
                            )
                          }
                        >
                          More Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-med">
                  No medicines listed for this record.
                </div>
              )}
            </div>

            <h3>Home Remedies</h3>
            <ul className="remedy-list">
              {Array.isArray(result.homeRemedies) &&
              result.homeRemedies.length > 0 ? (
                result.homeRemedies.map((r, i) => (
                  <li key={i}>
                    <span className="tick">✅</span> {r}
                  </li>
                ))
              ) : (
                <li>No home remedies listed.</li>
              )}
            </ul>

            <div className="precaution-box">
              <strong>Precautions:</strong>
              <p>{result.precautions || "No specific precautions listed."}</p>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="btn-primary"
                onClick={() => navigate("/medicines")}
              >
                Go to Medicines Page
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default SymptomChecker;
