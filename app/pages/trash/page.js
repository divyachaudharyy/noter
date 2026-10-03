"use client";
import { useEffect, useState } from "react";

export default function TrashPage() {
  const [pages, setPages] = useState([]);

  const loadTrash = async () => {
    const res = await fetch("/api/trash");
    const data = await res.json();
    setPages(data);
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const restorePage = async (pageId) => {
    await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: false }),
    });
    loadTrash();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Trash</h1>
      {pages.map((page) => (
        <div key={page._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span>{page.title}</span>
          <button onClick={() => restorePage(page._id)}>Restore</button>
        </div>
      ))}
    </div>
  );
}