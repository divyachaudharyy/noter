"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageItem from "./PageItem";

export default function Sidebar() {
    const [pages, setPages] = useState([]);
    const router = useRouter();

    const loadRootPages = async () => {
        const res = await fetch(`/api/pages`);
        const data = await res.json();
        setPages(data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRootPages();
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
            <button onClick={createPage}>+ New Page</button>
            <div style={{ marginTop: 12 }}>
                {pages.map((page) => (
                    <PageItem key={page._id} page={page} />
                ))}
            </div>
        </div>
    );
}