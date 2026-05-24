"use client";
import { useCallback, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface DropzoneProps {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onFile: (file: File | null) => void;
}

export function Dropzone({ label, hint, accept, file, onFile }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const handle = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFile(files[0]);
    },
    [onFile],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium text-ink">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center",
          over
            ? "border-gold bg-gold/5"
            : file
              ? "border-gold-light bg-cream"
              : "border-gold-light/70 bg-cream hover:bg-cream-dark",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handle(e.target.files)}
        />
        {file ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-ink truncate">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFile(null);
              }}
              className="text-ink-muted hover:text-ink p-1 rounded"
              aria-label={`Remove ${label}`}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-2">
            <UploadCloud size={20} className="text-gold" />
            <p className="text-sm text-ink-muted">
              Drop here or <span className="text-gold font-medium">browse</span>
            </p>
            <p className="text-xs text-ink-muted/70">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
