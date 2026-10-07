"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { uploadImage } from "@/lib/uploadImage";
import Image from 'next/image'
import { useRouter } from "next/navigation";

export default function PageView() {
  const { pageId } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const editor = useCreateBlockNote();

  useEffect(() => {
    fetch(`/api/pages/${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        setPage(data);
        if (data.content) {
          const blocks = JSON.parse(data.content);
          editor.replaceBlocks(editor.document, blocks);
        }
        setLoading(false);
      });
  }, [pageId]);
  const router = useRouter();
  const updateTitle = async (newTitle) => {
    setPage({ ...page, title: newTitle });
    await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    window.dispatchEvent(new Event("pages-updated"));
  };


  const archivePage = async () => {
    await fetch(`/api/pages/${pageId}`, { method: "DELETE" });
    window.dispatchEvent(new Event("pages-updated"));  // ← yeh add kar
    router.push("/pages");
  };
  const saveContent = useCallback(async () => {
    const content = JSON.stringify(editor.document);
    await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }, [pageId, editor]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <div>
        {page.coverImage && (
          <img
            src={page.coverImage}
            style={{ width: "100%", height: 280, objectFit: "contain", objectPosition: "center" }}
          />)}

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const url = await uploadImage(file);
            await fetch(`/api/pages/${pageId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ coverImage: url }),
            });
            setPage({ ...page, coverImage: url });
          }}
        />
      </div>
      <input
        type="text"
        value={page.title}
        onChange={(e) => setPage({ ...page, title: e.target.value })}
        onBlur={(e) => updateTitle(e.target.value)}
        style={{ fontSize: 32, fontWeight: "bold", border: "none", outline: "none", width: "100%" }}
      />
      <button onClick={archivePage}>🗑️ Delete</button>
      <BlockNoteView editor={editor} onChange={saveContent} />
    </div>
  );
}