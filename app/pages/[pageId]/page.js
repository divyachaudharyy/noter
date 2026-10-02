"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

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
      <h1>{page.title}</h1>
      <BlockNoteView editor={editor} onChange={saveContent} />
    </div>
  );
}