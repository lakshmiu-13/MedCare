// src/pages/MedicinePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MedicinePage.css";

export default function MedicinePage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [med, setMed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState({
    usage: true,
    dosage: false,
    sideEffects: false,
    precautions: false,
    alternatives: false,
    homeRemedies: false,
    relatedDiseases: false,
  });

  useEffect(() => {
    const fetchMed = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/medicines/${encodeURIComponent(name)}`);
        setMed(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Medicine not found");
      } finally {
        setLoading(false);
      }
    };
    fetchMed();
  }, [name]);

  const toggle = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div className="mp-page"><div className="mp-card">Loading medicine info...</div></div>;
  if (error) return <div className="mp-page"><div className="mp-card mp-error">{error}</div></div>;
  if (!med) return null;

  return (
    <div className="mp-page">
      <div className="mp-card">
        <div className="mp-header">
          <div className="mp-left">
            <h1 className="mp-title">{med.name}</h1>
            <p className="mp-sub">{med.shortInfo}</p>
            <div className="mp-tags">
              {med.dosage && <span className="tag">Dosage: {med.dosage.split(".")[0]}</span>}
              {med.usage && <span className="tag">Usage</span>}
            </div>
          </div>
          <div className="mp-image">
            <img
              src={med.image || ""}
              alt={med.name}
              onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='12'%3Eno image%3C/text%3E%3C/svg%3E"; }}
            />
          </div>
        </div>

        {/* Emergency / Warning */}
        <div className="mp-warning">
          ⚠️ This is informational only. If symptoms persist or worsen, consult a clinician.
        </div>

        {/* Accordions / sections */}
        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("usage")}>
            Usage & Purpose {openSections.usage ? "▲" : "▼"}
          </button>
          {openSections.usage && <div className="mp-body">{med.usage || "No usage info provided."}</div>}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("dosage")}>
            Dosage {openSections.dosage ? "▲" : "▼"}
          </button>
          {openSections.dosage && <div className="mp-body">{med.dosage || "No dosage info provided."}</div>}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("sideEffects")}>
            Side Effects {openSections.sideEffects ? "▲" : "▼"}
          </button>
          {openSections.sideEffects && (
            <div className="mp-body">
              {Array.isArray(med.sideEffects) && med.sideEffects.length > 0 ? (
                <ul>{med.sideEffects.map((s, i) => <li key={i}>{s}</li>)}</ul>
              ) : <div>No side effects listed.</div>}
            </div>
          )}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("precautions")}>
            Precautions {openSections.precautions ? "▲" : "▼"}
          </button>
          {openSections.precautions && <div className="mp-body">{Array.isArray(med.precautions) ? med.precautions.join(", ") : med.precautions || "No precautions listed."}</div>}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("alternatives")}>
            Alternatives {openSections.alternatives ? "▲" : "▼"}
          </button>
          {openSections.alternatives && (
            <div className="mp-body">
              {Array.isArray(med.alternatives) && med.alternatives.length > 0 ? (
                <div className="alt-grid">
                  {med.alternatives.map((a, i) => (
                    <div className="alt-card" key={i} onClick={() => navigate(`/medicine/${encodeURIComponent(a)}`)}>
                      <div className="alt-name">{a}</div>
                    </div>
                  ))}
                </div>
              ) : <div>No alternatives listed.</div>}
            </div>
          )}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("homeRemedies")}>
            Home Remedies {openSections.homeRemedies ? "▲" : "▼"}
          </button>
          {openSections.homeRemedies && <div className="mp-body">{Array.isArray(med.homeRemedies) && med.homeRemedies.length > 0 ? <ul>{med.homeRemedies.map((h,i)=><li key={i}>{h}</li>)}</ul> : <div>No home remedies listed.</div>}</div>}
        </div>

        <div className="mp-section">
          <button className="mp-acc" onClick={() => toggle("relatedDiseases")}>
            Related Diseases {openSections.relatedDiseases ? "▲" : "▼"}
          </button>
          {openSections.relatedDiseases && <div className="mp-body">{Array.isArray(med.relatedDiseases) && med.relatedDiseases.length > 0 ? <ul>{med.relatedDiseases.map((d,i)=><li key={i}>{d}</li>)}</ul> : <div>No related diseases listed.</div>}</div>}
        </div>

        <div className="mp-actions">
          <button className="btn-primary" onClick={() => navigate(-1)}>🔙 Back</button>
          <button className="btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to Top</button>
        </div>

      </div>
    </div>
  );
}