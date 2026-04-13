"use client";
import React, { useRef } from "react";
import {
  Plus, Trash2, GripVertical, Image as ImageIcon,
  ChevronDown, ChevronUp, Upload
} from "lucide-react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor";
import type {
  RecipeCardFields, InfographicCardFields, BeverageCardFields,
  IngredientItem, InstructionStep
} from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[10px] font-black uppercase tracking-widest text-gold border-b border-gold-light pb-1 mb-3 mt-4">
      {title}
    </div>
  );
}

function BilingualField({
  label, en, ar,
  onChangeEn, onChangeAr,
  multiline = false
}: {
  label: string;
  en: string;
  ar: string;
  onChangeEn: (v: string) => void;
  onChangeAr: (v: string) => void;
  multiline?: boolean;
}) {
  const FieldComp = multiline ? Textarea : Input;
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] font-semibold text-ink">{label}</div>
      <FieldComp
        label="EN"
        value={en}
        onChange={(e) => onChangeEn(e.target.value)}
        placeholder="English"
        dir="ltr"
      />
      <FieldComp
        label="AR"
        value={ar}
        onChange={(e) => onChangeAr(e.target.value)}
        placeholder="عربي"
        dir="rtl"
        className="text-right font-arabic"
      />
    </div>
  );
}

function ImageUploadField({
  label, value, onChange
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-[11px] font-semibold text-ink">{label}</div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className="w-full h-24 object-cover rounded-lg border border-gold-light"
        />
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <Button
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => fileRef.current?.click()}
        className="w-full gap-2"
      >
        <Upload size={14} />
        {value ? "Replace Image" : "Upload Image"}
      </Button>
      {value && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          hint="Or paste an image URL"
          className="text-xs"
        />
      )}
    </div>
  );
}

function IngredientsEditor({
  items, onChange
}: {
  items: IngredientItem[];
  onChange: (items: IngredientItem[]) => void;
}) {
  const updateItem = (id: string, patch: Partial<IngredientItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter((it) => it.id !== id));
  const addItem = () =>
    onChange([
      ...items,
      {
        id: uuid(),
        icon: "🧪",
        label: { en: "Ingredient", ar: "مكوّن" },
        amount: "100g",
      },
    ]);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="bg-cream-dark border border-gold-light/50 rounded-lg p-2.5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <GripVertical size={14} className="text-ink-muted/50 shrink-0" />
            <span className="text-xs font-semibold text-ink-muted">#{i + 1}</span>
            <Input
              value={item.icon}
              onChange={(e) => updateItem(item.id, { icon: e.target.value })}
              className="w-16 text-center text-lg px-1"
              title="Emoji icon"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="ms-auto p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={13} />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <Input
              value={item.label.en}
              onChange={(e) => updateItem(item.id, { label: { ...item.label, en: e.target.value } })}
              placeholder="Label EN"
              className="text-xs"
            />
            <Input
              value={item.label.ar}
              onChange={(e) => updateItem(item.id, { label: { ...item.label, ar: e.target.value } })}
              placeholder="العنوان"
              className="text-xs text-right font-arabic"
              dir="rtl"
            />
          </div>
          <Input
            value={item.amount}
            onChange={(e) => updateItem(item.id, { amount: e.target.value })}
            placeholder="Amount (e.g. 100g)"
            className="text-xs"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full gap-1.5">
        <Plus size={14} /> Add Ingredient
      </Button>
    </div>
  );
}

function StepsEditor({
  items,
  onChange,
  addLabel = "Add Step",
}: {
  items: InstructionStep[];
  onChange: (items: InstructionStep[]) => void;
  addLabel?: string;
}) {
  const updateItem = (id: string, patch: Partial<InstructionStep>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };
  const removeItem = (id: string) => onChange(items.filter((it) => it.id !== id));
  const addItem = () =>
    onChange([
      ...items,
      { id: uuid(), icon: "👨‍🍳", text: { en: "New step", ar: "خطوة جديدة" } },
    ]);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="bg-cream-dark border border-gold-light/50 rounded-lg p-2.5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-full bg-gold text-white flex items-center justify-center text-[9px] font-black shrink-0">
              {i + 1}
            </div>
            <Input
              value={item.icon}
              onChange={(e) => updateItem(item.id, { icon: e.target.value })}
              className="w-16 text-center text-lg px-1"
              title="Emoji icon"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="ms-auto p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={13} />
            </Button>
          </div>
          <Textarea
            value={item.text.en}
            onChange={(e) => updateItem(item.id, { text: { ...item.text, en: e.target.value } })}
            placeholder="Instruction (EN)"
            className="text-xs min-h-[50px]"
          />
          <Textarea
            value={item.text.ar}
            onChange={(e) => updateItem(item.id, { text: { ...item.text, ar: e.target.value } })}
            placeholder="التعليمات (AR)"
            className="text-xs min-h-[50px] text-right font-arabic"
            dir="rtl"
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full gap-1.5">
        <Plus size={14} /> {addLabel}
      </Button>
    </div>
  );
}

// ─── Recipe Card Panel ────────────────────────────────────────────────────────

function RecipeCardPanel({ fields }: { fields: RecipeCardFields }) {
  const { updateFields } = useEditorStore();
  const [openSection, setOpenSection] = React.useState<string | null>("title");

  const toggle = (s: string) => setOpenSection((v) => (v === s ? null : s));

  const f = (path: string) => ({
    onClick: () => toggle(path),
    open: openSection === path,
  });

  function Collapsible({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    const open = openSection === id;
    return (
      <div className="border border-gold-light/50 rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between px-3 py-2.5 bg-cream-dark hover:bg-gold-light/30 transition-colors text-sm font-semibold text-ink"
          onClick={() => toggle(id)}
        >
          {label}
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {open && <div className="p-3 flex flex-col gap-3">{children}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-6">
      <Collapsible id="hero" label="Hero Image">
        <ImageUploadField
          label="Food Photo"
          value={fields.heroImage}
          onChange={(url) => updateFields({ heroImage: url })}
        />
      </Collapsible>

      <Collapsible id="title" label="Title & Subtitle">
        <BilingualField
          label="Recipe Title"
          en={fields.title.en}
          ar={fields.title.ar}
          onChangeEn={(v) => updateFields({ title: { ...fields.title, en: v } })}
          onChangeAr={(v) => updateFields({ title: { ...fields.title, ar: v } })}
        />
        <BilingualField
          label="Subtitle"
          en={fields.subtitle.en}
          ar={fields.subtitle.ar}
          onChangeEn={(v) => updateFields({ subtitle: { ...fields.subtitle, en: v } })}
          onChangeAr={(v) => updateFields({ subtitle: { ...fields.subtitle, ar: v } })}
          multiline
        />
      </Collapsible>

      <Collapsible id="meta" label="Prep Time / Cook Time / Yield">
        <Input label="Prep Time" value={fields.prepTime} onChange={(e) => updateFields({ prepTime: e.target.value })} />
        <Input label="Cook Time" value={fields.cookTime} onChange={(e) => updateFields({ cookTime: e.target.value })} />
        <Input label="Yield / Servings" value={fields.servings} onChange={(e) => updateFields({ servings: e.target.value })} />
        <Input label="Difficulty" value={fields.difficulty} onChange={(e) => updateFields({ difficulty: e.target.value })} />
      </Collapsible>

      <Collapsible id="ingredients" label={`Ingredients (${fields.ingredients.length})`}>
        <IngredientsEditor
          items={fields.ingredients}
          onChange={(items) => updateFields({ ingredients: items })}
        />
      </Collapsible>

      <Collapsible id="instructions" label={`Instructions (${fields.instructions.length} steps)`}>
        <StepsEditor
          items={fields.instructions}
          onChange={(items) => updateFields({ instructions: items })}
        />
      </Collapsible>

      <Collapsible id="badge" label="Footer / Badge">
        <BilingualField
          label="Badge Text"
          en={fields.badgeText.en}
          ar={fields.badgeText.ar}
          onChangeEn={(v) => updateFields({ badgeText: { ...fields.badgeText, en: v } })}
          onChangeAr={(v) => updateFields({ badgeText: { ...fields.badgeText, ar: v } })}
        />
        <BilingualField
          label="Tagline"
          en={fields.tagline.en}
          ar={fields.tagline.ar}
          onChangeEn={(v) => updateFields({ tagline: { ...fields.tagline, en: v } })}
          onChangeAr={(v) => updateFields({ tagline: { ...fields.tagline, ar: v } })}
        />
      </Collapsible>

      <Collapsible id="theme" label="Colors">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-ink flex-1">Accent Color</label>
          <input
            type="color"
            value={fields.primaryColor}
            onChange={(e) => updateFields({ primaryColor: e.target.value })}
            className="w-10 h-8 rounded cursor-pointer border border-gold-light"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-ink flex-1">Background Color</label>
          <input
            type="color"
            value={fields.backgroundColor}
            onChange={(e) => updateFields({ backgroundColor: e.target.value })}
            className="w-10 h-8 rounded cursor-pointer border border-gold-light"
          />
        </div>
      </Collapsible>
    </div>
  );
}

// ─── Infographic Panel ────────────────────────────────────────────────────────

function InfographicPanel({ fields }: { fields: InfographicCardFields }) {
  const { updateFields } = useEditorStore();
  const [open, setOpen] = React.useState<string | null>("title");
  const toggle = (s: string) => setOpen((v) => (v === s ? null : s));

  function C({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    return (
      <div className="border border-gold-light/50 rounded-lg overflow-hidden">
        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-cream-dark hover:bg-gold-light/30 transition-colors text-sm font-semibold text-ink" onClick={() => toggle(id)}>
          {label}
          {open === id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {open === id && <div className="p-3 flex flex-col gap-3">{children}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-6">
      <C id="title" label="Title & Prep Time">
        <BilingualField label="Title" en={fields.title.en} ar={fields.title.ar}
          onChangeEn={(v) => updateFields({ title: { ...fields.title, en: v } })}
          onChangeAr={(v) => updateFields({ title: { ...fields.title, ar: v } })} />
        <Input label="Prep Time" value={fields.prepTime} onChange={(e) => updateFields({ prepTime: e.target.value })} />
      </C>
      <C id="hero" label="Hero Image">
        <ImageUploadField label="Food Photo" value={fields.heroImage} onChange={(url) => updateFields({ heroImage: url })} />
      </C>
      <C id="ingredients" label={`Ingredients (${fields.ingredients.length})`}>
        <IngredientsEditor items={fields.ingredients} onChange={(items) => updateFields({ ingredients: items })} />
      </C>
      <C id="dosage" label="Dosage Information">
        <div className="text-xs font-semibold text-ink mb-1">Essence</div>
        <div className="grid grid-cols-3 gap-1.5">
          <Input value={fields.dosageEssence.icon} onChange={(e) => updateFields({ dosageEssence: { ...fields.dosageEssence, icon: e.target.value } })} className="text-center text-lg" />
          <Input value={fields.dosageEssence.amount} onChange={(e) => updateFields({ dosageEssence: { ...fields.dosageEssence, amount: e.target.value } })} placeholder="Amount" />
          <Input value={fields.dosageEssence.range} onChange={(e) => updateFields({ dosageEssence: { ...fields.dosageEssence, range: e.target.value } })} placeholder="Range" />
        </div>
        <div className="text-xs font-semibold text-ink mb-1 mt-2">Emulsion</div>
        <div className="grid grid-cols-3 gap-1.5">
          <Input value={fields.dosageEmulsion.icon} onChange={(e) => updateFields({ dosageEmulsion: { ...fields.dosageEmulsion, icon: e.target.value } })} className="text-center text-lg" />
          <Input value={fields.dosageEmulsion.amount} onChange={(e) => updateFields({ dosageEmulsion: { ...fields.dosageEmulsion, amount: e.target.value } })} placeholder="Amount" />
          <Input value={fields.dosageEmulsion.range} onChange={(e) => updateFields({ dosageEmulsion: { ...fields.dosageEmulsion, range: e.target.value } })} placeholder="Range" />
        </div>
      </C>
      <C id="steps" label={`Instructions (${fields.instructions.length} steps)`}>
        <StepsEditor items={fields.instructions} onChange={(items) => updateFields({ instructions: items })} />
      </C>
    </div>
  );
}

// ─── Beverage Panel ───────────────────────────────────────────────────────────

function BeveragePanel({ fields }: { fields: BeverageCardFields }) {
  const { updateFields } = useEditorStore();
  const [open, setOpen] = React.useState<string | null>("title");
  const toggle = (s: string) => setOpen((v) => (v === s ? null : s));

  function C({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
    return (
      <div className="border border-gold-light/50 rounded-lg overflow-hidden">
        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-cream-dark hover:bg-gold-light/30 transition-colors text-sm font-semibold text-ink" onClick={() => toggle(id)}>
          {label}
          {open === id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {open === id && <div className="p-3 flex flex-col gap-3">{children}</div>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pb-6">
      <C id="title" label="Title & Subtitle">
        <BilingualField label="Title" en={fields.title.en} ar={fields.title.ar}
          onChangeEn={(v) => updateFields({ title: { ...fields.title, en: v } })}
          onChangeAr={(v) => updateFields({ title: { ...fields.title, ar: v } })} />
        <BilingualField label="Subtitle" en={fields.subtitle.en} ar={fields.subtitle.ar}
          onChangeEn={(v) => updateFields({ subtitle: { ...fields.subtitle, en: v } })}
          onChangeAr={(v) => updateFields({ subtitle: { ...fields.subtitle, ar: v } })} />
      </C>
      <C id="ingredients" label={`Ingredients (${fields.ingredients.length})`}>
        <IngredientsEditor items={fields.ingredients} onChange={(items) => updateFields({ ingredients: items })} />
      </C>
      <C id="dosage" label="Dosage">
        <div className="grid grid-cols-3 gap-1.5">
          <Input value={fields.dosage.icon} onChange={(e) => updateFields({ dosage: { ...fields.dosage, icon: e.target.value } })} className="text-center text-lg" />
          <Input value={fields.dosage.amount} onChange={(e) => updateFields({ dosage: { ...fields.dosage, amount: e.target.value } })} placeholder="Amount" />
          <Input value={fields.dosage.range} onChange={(e) => updateFields({ dosage: { ...fields.dosage, range: e.target.value } })} placeholder="Range" />
        </div>
      </C>
      <C id="steps" label={`Preparation Steps (${fields.steps.length})`}>
        <StepsEditor items={fields.steps} onChange={(items) => updateFields({ steps: items })} addLabel="Add Step" />
      </C>
      <C id="storage" label="Storage Note">
        <BilingualField label="Storage Note" en={fields.storageNote.en} ar={fields.storageNote.ar}
          onChangeEn={(v) => updateFields({ storageNote: { ...fields.storageNote, en: v } })}
          onChangeAr={(v) => updateFields({ storageNote: { ...fields.storageNote, ar: v } })}
          multiline />
      </C>
    </div>
  );
}

// ─── Main FieldPanel export ───────────────────────────────────────────────────

export function FieldPanel() {
  const { document } = useEditorStore();
  if (!document) return null;

  const fields = document.fields;

  return (
    <div className="h-full overflow-y-auto p-3 flex flex-col gap-1">
      {document.templateType === "recipe-card" && (
        <RecipeCardPanel fields={fields as RecipeCardFields} />
      )}
      {document.templateType === "infographic-card" && (
        <InfographicPanel fields={fields as InfographicCardFields} />
      )}
      {document.templateType === "beverage-card" && (
        <BeveragePanel fields={fields as BeverageCardFields} />
      )}
    </div>
  );
}
