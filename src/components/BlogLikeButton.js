import { useEffect, useState } from "react";

const API = process.env.REACT_APP_LIKES_API_URL;

function storageKey(slug) {
  return `blog-liked:${slug}`;
}

export default function BlogLikeButton({ slug }) {
  const [count, setCount] = useState(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(storageKey(slug)) === "1");
    setBusy(false);
    setCount(null);

    if (!API) return;

    fetch(`${API}/likes/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => setCount(0));
  }, [slug]);

  const toggle = async () => {
    if (!API || busy || liked) return;

    setBusy(true);
    try {
      const res = await fetch(
        `${API}/likes/${encodeURIComponent(slug)}`,
        { method: "POST" }
      );
      const data = await res.json();
      setCount(data.count);
      setLiked(true);
      localStorage.setItem(storageKey(slug), "1");
    } finally {
      setBusy(false);
    }
  };

  if (!API) return null;

  return (
    <button
      type="button"
      className={`Blog-like${liked ? " is-liked" : ""}`}
      onClick={toggle}
      disabled={busy || liked}
      aria-pressed={liked}
      aria-label={liked ? "Liked" : "Like this post"}
    >
      {liked ? "♥" : "♡"} {count !== null && count > 0 ? count : ""}
    </button>
  );
}
