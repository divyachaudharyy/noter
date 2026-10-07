"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageItem from "./PageItem";
import Link from "next/link";

export default function Sidebar() {
    const [pages, setPages] = useState([]);
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (!q) {
            setSearchResults([]);
            return;
        }
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSearchResults(data);
    };
    const loadRootPages = async () => {
        const res = await fetch(`/api/pages`);
        const data = await res.json();
        setPages(data);
    };

    useEffect(() => {
        loadRootPages();

        window.addEventListener("pages-updated", loadRootPages);
        return () => window.removeEventListener("pages-updated", loadRootPages);
    }, []);

    const createPage = async () => {
        const res = await fetch(`/api/pages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ parentPage: null }),
        });
        const newPage = await res.json();
        setPages([newPage, ...pages]);
        router.push(`/pages/${newPage._id}`);
    };

    return (
        <div style={{ width: 240, borderRight: "1px solid #ddd", padding: 8 }}>
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />

            {searchQuery && (
                <div>
                    {searchResults.map((page) => (
                        <div key={page._id} onClick={() => router.push(`/pages/${page._id}`)} style={{ cursor: "pointer", padding: "4px 0" }}>
                            🔍 {page.title}
                        </div>
                    ))}
                </div>
            )}
            <button onClick={createPage}>+ New Page</button>
            <Link href="/pages/trash">🗑️ Trash</Link>
            <div style={{ marginTop: 12 }}>
                {pages.map((page) => (
                    <PageItem key={page._id} page={page} />
                ))}
            </div>
        </div>
    );
}