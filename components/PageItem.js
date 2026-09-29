"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PageItem({ page }) {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [loadedChildren, setLoadedChildren] = useState(false);
  const router = useRouter();

  const toggleExpand = async (e) => {
    e.stopPropagation();
    if (!loadedChildren) {
      const res = await fetch(`/api/pages?parentPage=${page._id}`);
      const data = await res.json();
      setChildren(data);
      setLoadedChildren(true);
    }
    setExpanded(!expanded);
  };

  const openPage = () => router.push(`/pages/${page._id}`);

  return (
    <div style={{ paddingLeft: 12 }}>
      <div
        onClick={openPage}
        style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "4px 0" }}
      >
        <span onClick={toggleExpand} style={{ marginRight: 4 }}>
          {expanded ? "▾" : "▸"}
        </span>
        <span>{page.icon || "📄"}</span>
        <span style={{ marginLeft: 6 }}>{page.title}</span>
      </div>

      {expanded && (
        <div>
          {children.map((child) => (
            <PageItem key={child._id} page={child} />
          ))}
        </div>
      )}
    </div>
  );
}