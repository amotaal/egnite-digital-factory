"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewDocumentButton({
  templateType,
  templateName,
}: {
  templateType: string;
  templateName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType,
          name: `Untitled ${templateName}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push(`/editor/${data.document.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      loading={loading}
      onClick={create}
      className="w-full gap-1.5"
    >
      <Plus size={14} />
      New {templateName}
    </Button>
  );
}
