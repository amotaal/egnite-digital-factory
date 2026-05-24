"use client";
import { useCallback, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface FlavorsInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ACCEPT = ".txt,.csv,.md,.html,text/plain,text/csv,text/markdown,text/html";

export function FlavorsInput({ value, onChange }: FlavorsInputProps) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const ingest = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      try {
        const text = await file.text();
        onChange(text);
        toast.success(`Loaded ${file.name}`);
      } catch {
        toast.error("Could not read file");
      }
    },
    [onChange, toast],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        void ingest(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-xl border-2 border-dashed transition-colors",
        over ? "border-gold bg-gold/5" : "border-transparent",
      )}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Almond\nAnise\nApple\n…\n\nOne flavor per line."}
        className="min-h-[180px] font-mono text-xs"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-ink-muted">Drop a .txt / .csv / .md / .html file here, or paste above.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-gold hover:text-gold-dark font-medium inline-flex items-center gap-1"
        >
          <FileText size={12} />
          Browse
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => void ingest(e.target.files)}
        />
      </div>
    </div>
  );
}
