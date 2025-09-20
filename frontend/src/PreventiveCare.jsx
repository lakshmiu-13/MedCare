import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PreventiveCare.css";
const fallbackImage =
  "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=60";
export default function PreventiveCare() {
  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const rotRef = useRef(null);
  useEffect(() => {
    const fetchTips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/preventive");
        setTips(res.data || []);
      } catch (err) {
        console.error("Failed to load preventive tips:", err);
        setTips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTips();
  }, []);
  const categories = [
    "All",
    ...Array.from(new Set(tips.map((t) => t.category).filter(Boolean))),
  ];
  useEffect(() => {
    if (!tips.length) return;
    rotRef.current = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(rotRef.current);
  }, [tips]);
  const filtered = tips.filter((t) => {
    if (category !== "All" && t.category !== category) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.category || "").toLowerCase().includes(q)
    );
  });
  return (
    <div className="pc-page">
      {" "}
      <nav className="pc-nav">
        {" "}
        <div className="pc-nav-left">
          {" "}
          <h1 className="pc-logo">💚 Preventive Care</h1>{" "}
        </div>{" "}
        <div className="pc-nav-right">
          {" "}
          <button className="pc-btn" onClick={() => navigate("/")}>
            Home
          </button>{" "}
          <button
            className="pc-btn"
            onClick={() => navigate("/symptom-checker")}
          >
            Symptom Checker
          </button>{" "}
        </div>{" "}
      </nav>{" "}
      <main className="pc-main-flex">
        {" "}
        {/* Left: Search + Results */}{" "}
        <div className="pc-left">
          {" "}
          <section className="pc-hero-left">
            {" "}
            <h2>Stay healthy — simple preventive tips & daily habits</h2>{" "}
            <p>Search or filter by category. Click a card to read more.</p>{" "}
            <div className="pc-controls">
              {" "}
              <input
                className="pc-search"
                placeholder="Search tips (e.g. vitamin, hygiene, exercise)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />{" "}
              <button
                className="pc-search-btn"
                onClick={() => setSearchQuery(searchInput)}
              >
                {" "}
                Search{" "}
              </button>{" "}
              <select
                className="pc-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {" "}
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </section>{" "}
          <section className="pc-grid-wrap">
            {" "}
            {loading ? (
              <div className="pc-loading">Loading preventive tips...</div>
            ) : filtered.length === 0 ? (
              <div className="pc-empty">
                No tips found. Try another search or category.
              </div>
            ) : (
              <div className="pc-grid">
                {" "}
                {filtered.map((tip, idx) => (
                  <article className="pc-card" key={tip._id || idx}>
                    {" "}
                    <div className="pc-card-media">
                      {" "}
                      <img
                        src={tip.image || fallbackImage}
                        alt={tip.title}
                      />{" "}
                    </div>{" "}
                    <div className="pc-card-body">
                      {" "}
                      <h3>{tip.title}</h3>{" "}
                      <p className="pc-desc">{tip.description}</p>{" "}
                    </div>{" "}
                  </article>
                ))}{" "}
              </div>
            )}{" "}
          </section>{" "}
        </div>{" "}
        {/* Right: Tip of the Day */}{" "}
        <div className="pc-right">
          {" "}
          <div className="tip-box">
            {" "}
            <h3>🌟 Tip of the Day</h3>{" "}
            {tips.length > 0 ? (
              <div className="pc-featured-card">
                {" "}
                <img
                  src={tips[featuredIndex].image || fallbackImage}
                  alt={tips[featuredIndex].title}
                />{" "}
                <div className="pc-featured-body">
                  {" "}
                  <h4>{tips[featuredIndex].title}</h4>{" "}
                  <p>{tips[featuredIndex].description}</p>{" "}
                </div>{" "}
              </div>
            ) : (
              <div className="pc-empty">No tips available yet.</div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </main>{" "}
    </div>
  );
}
