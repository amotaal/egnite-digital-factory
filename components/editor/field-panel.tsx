"use client";
import React, { useRef } from "react";
import {
  Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Upload, Image as ImageIcon,
} from "lucide-react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useEditorStore } from "@/lib/store/editor";
import { AssetPickerModal } from "./asset-picker";
import type {
  RecipeCardFields, InfographicCardFields, BeverageCardFields,
  IngredientItem, InstructionStep, DocumentSection,
} from "@/lib/types";

// ─── Per-language config ──────────────────────────────────────────────────────

export type PanelLang = "en" | "ar";

interface LangConfig {
  code: PanelLang;
  dir: "ltr" | "rtl";
  placeholder: { label: string; amount: string; instruction: string };
  textClass: string;
}

const LANG_CONFIG: Record<PanelLang, LangConfig> = {
  en: {
    code: "en",
    dir: "ltr",
    placeholder: { label: "English label", amount: "100g (1 stick)", instruction: "Instruction in English…" },
    textClass: "",
  },
  ar: {
    code: "ar",
    dir: "rtl",
    placeholder: { label: "التسمية بالعربية", amount: "١٠٠ جم", instruction: "التعليمات بالعربية…" },
    textClass: "text-right font-arabic",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SingleLangField({
  label, value, onChange, config, multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  config: LangConfig;
  multiline?: boolean;
}) {
  const FieldComp = multiline ? Textarea : Input;
  return (
    <FieldComp
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder.label}
      dir={config.dir}
      className={config.textClass}
    />
  );
}

function ImageUploadField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) onChange(data.url);
      else setError(data.error ?? "Upload failed");
    } catch {
      setError("Network error");
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
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => fileRef.current?.click()}
          className="gap-1.5"
        >
          <Upload size={14} />
          Upload
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPicker(true)}
          className="gap-1.5"
        >
          <ImageIcon size={14} />
          Library
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {value && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          hint="Or paste an image URL"
          className="text-xs"
        />
      )}
      {showPicker && (
        <AssetPickerModal
          onSelect={(asset) => {
            onChange(asset.url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
          category="image"
        />
      )}
    </div>
  );
}

function IconField({
  value, onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [showPicker, setShowPicker] = React.useState(false);
  return (
    <>
      <div className="flex items-center gap-1">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 text-center text-lg px-1"
          title="Emoji or asset URL"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPicker(true)}
          className="p-1"
          title="Pick from library"
        >
          <ImageIcon size={13} />
        </Button>
      </div>
      {showPicker && (
        <AssetPickerModal
          onSelect={(asset) => {
            onChange(asset.icon ?? asset.url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
          category="icon"
        />
      )}
    </>
  );
}

function IngredientsEditor({
  items, onChange, config,
}: {
  items: IngredientItem[];
  onChange: (items: IngredientItem[]) => void;
  config: LangConfig;
}) {
  const updateItem = (id: string, patch: Partial<IngredientItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (id: string) => onChange(items.filter((it) => it.id !== id));
  const addItem = () =>
    onChange([
      ...items,
      { id: uuid(), icon: "🧪", label: { en: "Ingredient", ar: "مكوّن" }, amount: "100g" },
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
            <IconField
              value={item.icon}
              onChange={(v) => updateItem(item.id, { icon: v })}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="ms-auto p-1 text-red-500 hover:text-red-700"
              aria-label={`Delete ingredient ${i + 1}`}
            >
              <Trash2 size={13} />
            </Button>
          </div>
          <Input
            value={item.label[config.code]}
            onChange={(e) =>
              updateItem(item.id, { label: { ...item.label, [config.code]: e.target.value } })
            }
            placeholder={config.placeholder.label}
            className={`text-xs ${config.textClass}`}
            dir={config.dir}
          />
          <Input
            value={item.amount}
            onChange={(e) => updateItem(item.id, { amount: e.target.value })}
            placeholder={config.placeholder.amount}
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
  items, onChange, config, addLabel = "Add Step",
}: {
  items: InstructionStep[];
  onChange: (items: InstructionStep[]) => void;
  config: LangConfig;
  addLabel?: string;
}) {
  const updateItem = (id: string, patch: Partial<InstructionStep>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
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
            <IconField
              value={item.icon}
              onChange={(v) => updateItem(item.id, { icon: v })}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="ms-auto p-1 text-red-500 hover:text-red-700"
              aria-label={`Delete step ${i + 1}`}
            >
              <Trash2 size={13} />
            </Button>
          </div>
          <Textarea
            value={item.text[config.code]}
            onChange={(e) =>
              updateItem(item.id, { text: { ...item.text, [config.code]: e.target.value } })
            }
            placeholder={config.placeholder.instruction}
            className={`text-xs min-h-[56px] ${config.textClass}`}
            dir={config.dir}
          />
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full gap-1.5">
        <Plus size={14} /> {addLabel}
      </Button>
    </div>
  );
}

// ─── Sections Editor ──────────────────────────────────────────────────────────

function SectionsEditor({
  sections, onChange, config,
}: {
  sections: DocumentSection[];
  onChange: (sections: DocumentSection[]) => void;
  config: LangConfig;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const addSection = () => {
    const newSec: DocumentSection = {
      id: uuid(),
      title: { en: "New Section", ar: "قسم جديد" },
      type: "ingredients",
      items: [],
    };
    onChange([...sections, newSec]);
    setOpenId(newSec.id);
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
    if (openId === id) setOpenId(null);
  };

  const updateSection = (id: string, patch: Partial<DocumentSection>) =>
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div className="flex flex-col gap-2">
      {sections.map((sec) => (
        <div key={sec.id} className="border border-gold-light/50 rounded-lg overflow-hidden">
          <div className="flex items-center bg-cream-dark px-3 py-2 gap-2">
            <button
              className="flex-1 text-sm font-semibold text-ink text-start truncate"
              onClick={() => setOpenId((v) => (v === sec.id ? null : sec.id))}
            >
              {sec.title[config.code] || "Untitled Section"}
            </button>
            {openId === sec.id ? (
              <ChevronUp size={13} className="text-ink-muted shrink-0" />
            ) : (
              <ChevronDown size={13} className="text-ink-muted shrink-0" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeSection(sec.id)}
              className="p-1 text-red-500 hover:text-red-700 shrink-0"
              aria-label="Delete section"
            >
              <Trash2 size={13} />
            </Button>
          </div>

          {openId === sec.id && (
            <div className="p-3 flex flex-col gap-3">
              <SingleLangField
                label="Section Title"
                value={sec.title[config.code]}
                onChange={(v) =>
                  updateSection(sec.id, { title: { ...sec.title, [config.code]: v } })
                }
                config={config}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => updateSection(sec.id, { type: "ingredients", items: [] })}
                  className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    sec.type === "ingredients"
                      ? "bg-gold text-white border-gold"
                      : "border-gold-light text-ink-muted hover:bg-cream"
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => updateSection(sec.id, { type: "instructions", items: [] })}
                  className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    sec.type === "instructions"
                      ? "bg-gold text-white border-gold"
                      : "border-gold-light text-ink-muted hover:bg-cream"
                  }`}
                >
                  Steps
                </button>
              </div>

              {sec.type === "ingredients" ? (
                <IngredientsEditor
                  items={sec.items as IngredientItem[]}
                  onChange={(items) => updateSection(sec.id, { items })}
                  config={config}
                />
              ) : (
                <StepsEditor
                  items={sec.items as InstructionStep[]}
                  onChange={(items) => updateSection(sec.id, { items })}
                  config={config}
                />
              )}
            </div>
          )}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addSection} className="w-full gap-1.5">
        <Plus size={14} /> Add Section
      </Button>
    </div>
  );
}

// ─── Shared Color Picker with presets ──────────────────────────────────────────

const BRAND_SWATCHES = [
  "#B78D4B", // Egnite gold
  "#8B6A35", // gold dark
  "#0E7C65", // emerald
  "#B91C55", // rose
  "#475569", // slate
  "#D97706", // amber
  "#0369A1", // ocean
  "#FCFAF4", // cream
];

function ColorPickers({
  primaryColor, backgroundColor,
  onChangePrimary, onChangeBg,
}: {
  primaryColor: string;
  backgroundColor: string;
  onChangePrimary: (v: string) => void;
  onChangeBg: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {[
        { label: "Accent Color", value: primaryColor, set: onChangePrimary },
        { label: "Background Color", value: backgroundColor, set: onChangeBg },
      ].map((row) => (
        <div key={row.label} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-ink flex-1">{row.label}</label>
            <input
              type="color"
              value={row.value}
              onChange={(e) => row.set(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gold-light"
              aria-label={row.label}
            />
            <span className="text-xs text-ink-muted font-mono">{row.value}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BRAND_SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => row.set(c)}
                className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                  row.value.toLowerCase() === c.toLowerCase()
                    ? "border-ink ring-2 ring-gold"
                    : "border-gold-light"
                }`}
                style={{ backgroundColor: c }}
                title={c}
                aria-label={`Set ${row.label} to ${c}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Collapsible primitive ─────────────────────────────────────────────────────

function Collapsible({
  id, label, openId, setOpenId, children,
}: {
  id: string;
  label: string;
  openId: string | null;
  setOpenId: (v: string | null) => void;
  children: React.ReactNode;
}) {
  const open = openId === id;
  return (
    <div className="border border-gold-light/50 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-3 py-2.5 bg-cream-dark hover:bg-gold-light/30 transition-colors text-sm font-semibold text-ink"
        onClick={() => setOpenId(open ? null : id)}
        aria-expanded={open}
      >
        {label}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="p-3 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

// ─── Recipe Card Panel (per language) ─────────────────────────────────────────

function RecipeCardPanel({ fields, config }: { fields: RecipeCardFields; config: LangConfig }) {
  const { updateFields } = useEditorStore();
  const [openSection, setOpenSection] = React.useState<string | null>("title");
  const shared = config.code === "en";

  return (
    <div className="flex flex-col gap-2 pb-6">
      {shared && (
        <Collapsible id="hero" label="Hero Image (shared)" openId={openSection} setOpenId={setOpenSection}>
          <ImageUploadField
            label="Food Photo"
            value={fields.heroImage}
            onChange={(url) => updateFields({ heroImage: url })}
          />
        </Collapsible>
      )}

      <Collapsible id="title" label="Title & Subtitle" openId={openSection} setOpenId={setOpenSection}>
        <SingleLangField
          label="Recipe Title"
          value={fields.title[config.code]}
          onChange={(v) => updateFields({ title: { ...fields.title, [config.code]: v } })}
          config={config}
        />
        <SingleLangField
          label="Subtitle"
          value={fields.subtitle[config.code]}
          onChange={(v) => updateFields({ subtitle: { ...fields.subtitle, [config.code]: v } })}
          config={config}
          multiline
        />
      </Collapsible>

      {shared && (
        <Collapsible id="meta" label="Prep · Cook · Yield (shared)" openId={openSection} setOpenId={setOpenSection}>
          <Input label="Prep Time" value={fields.prepTime} onChange={(e) => updateFields({ prepTime: e.target.value })} />
          <Input label="Cook Time" value={fields.cookTime} onChange={(e) => updateFields({ cookTime: e.target.value })} />
          <Input label="Yield / Servings" value={fields.servings} onChange={(e) => updateFields({ servings: e.target.value })} />
          <Input label="Difficulty" value={fields.difficulty} onChange={(e) => updateFields({ difficulty: e.target.value })} />
        </Collapsible>
      )}

      <Collapsible id="ingredients" label={`Ingredients (${fields.ingredients.length})`} openId={openSection} setOpenId={setOpenSection}>
        <IngredientsEditor
          items={fields.ingredients}
          onChange={(items) => updateFields({ ingredients: items })}
          config={config}
        />
      </Collapsible>

      <Collapsible id="instructions" label={`Instructions (${fields.instructions.length} steps)`} openId={openSection} setOpenId={setOpenSection}>
        <StepsEditor
          items={fields.instructions}
          onChange={(items) => updateFields({ instructions: items })}
          config={config}
        />
      </Collapsible>

      <Collapsible id="sections" label={`Extra Sections (${fields.sections.length})`} openId={openSection} setOpenId={setOpenSection}>
        <p className="text-xs text-ink-muted">
          Add sub-sections like &quot;Chocolate Coating&quot; or &quot;Frosting&quot; below the main recipe body.
        </p>
        <SectionsEditor
          sections={fields.sections}
          onChange={(sections) => updateFields({ sections })}
          config={config}
        />
      </Collapsible>

      <Collapsible id="badge" label="Footer / Badge" openId={openSection} setOpenId={setOpenSection}>
        <SingleLangField
          label="Badge Text"
          value={fields.badgeText[config.code]}
          onChange={(v) => updateFields({ badgeText: { ...fields.badgeText, [config.code]: v } })}
          config={config}
        />
        <SingleLangField
          label="Tagline"
          value={fields.tagline[config.code]}
          onChange={(v) => updateFields({ tagline: { ...fields.tagline, [config.code]: v } })}
          config={config}
        />
      </Collapsible>

      {shared && (
        <Collapsible id="theme" label="Colors (shared)" openId={openSection} setOpenId={setOpenSection}>
          <ColorPickers
            primaryColor={fields.primaryColor}
            backgroundColor={fields.backgroundColor}
            onChangePrimary={(v) => updateFields({ primaryColor: v })}
            onChangeBg={(v) => updateFields({ backgroundColor: v })}
          />
        </Collapsible>
      )}
    </div>
  );
}

// ─── Infographic Panel (per language) ────────────────────────────────────────

function InfographicPanel({ fields, config }: { fields: InfographicCardFields; config: LangConfig }) {
  const { updateFields } = useEditorStore();
  const [open, setOpen] = React.useState<string | null>("title");
  const shared = config.code === "en";

  return (
    <div className="flex flex-col gap-2 pb-6">
      <Collapsible id="title" label="Title" openId={open} setOpenId={setOpen}>
        <SingleLangField
          label="Title"
          value={fields.title[config.code]}
          onChange={(v) => updateFields({ title: { ...fields.title, [config.code]: v } })}
          config={config}
        />
        {shared && (
          <Input label="Prep Time" value={fields.prepTime} onChange={(e) => updateFields({ prepTime: e.target.value })} />
        )}
      </Collapsible>

      {shared && (
        <Collapsible id="hero" label="Hero Image (shared)" openId={open} setOpenId={setOpen}>
          <ImageUploadField label="Food Photo" value={fields.heroImage} onChange={(url) => updateFields({ heroImage: url })} />
        </Collapsible>
      )}

      <Collapsible id="ingredients" label={`Ingredients (${fields.ingredients.length})`} openId={open} setOpenId={setOpen}>
        <IngredientsEditor items={fields.ingredients} onChange={(items) => updateFields({ ingredients: items })} config={config} />
      </Collapsible>

      {shared && (
        <Collapsible id="dosage" label="Dosage (shared)" openId={open} setOpenId={setOpen}>
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
        </Collapsible>
      )}

      <Collapsible id="steps" label={`Instructions (${fields.instructions.length} steps)`} openId={open} setOpenId={setOpen}>
        <StepsEditor items={fields.instructions} onChange={(items) => updateFields({ instructions: items })} config={config} />
      </Collapsible>

      <Collapsible id="footer" label="Footer Tagline" openId={open} setOpenId={setOpen}>
        <SingleLangField
          label="Tagline"
          value={fields.footerTagline[config.code]}
          onChange={(v) => updateFields({ footerTagline: { ...fields.footerTagline, [config.code]: v } })}
          config={config}
        />
      </Collapsible>

      {shared && (
        <Collapsible id="theme" label="Colors (shared)" openId={open} setOpenId={setOpen}>
          <ColorPickers
            primaryColor={fields.primaryColor}
            backgroundColor={fields.backgroundColor}
            onChangePrimary={(v) => updateFields({ primaryColor: v })}
            onChangeBg={(v) => updateFields({ backgroundColor: v })}
          />
        </Collapsible>
      )}
    </div>
  );
}

// ─── Beverage Panel (per language) ────────────────────────────────────────────

function BeveragePanel({ fields, config }: { fields: BeverageCardFields; config: LangConfig }) {
  const { updateFields } = useEditorStore();
  const [open, setOpen] = React.useState<string | null>("title");
  const shared = config.code === "en";

  return (
    <div className="flex flex-col gap-2 pb-6">
      <Collapsible id="title" label="Title & Subtitle" openId={open} setOpenId={setOpen}>
        <SingleLangField
          label="Title"
          value={fields.title[config.code]}
          onChange={(v) => updateFields({ title: { ...fields.title, [config.code]: v } })}
          config={config}
        />
        <SingleLangField
          label="Subtitle"
          value={fields.subtitle[config.code]}
          onChange={(v) => updateFields({ subtitle: { ...fields.subtitle, [config.code]: v } })}
          config={config}
        />
      </Collapsible>

      {shared && (
        <Collapsible id="hero" label="Hero Image (shared)" openId={open} setOpenId={setOpen}>
          <ImageUploadField label="Food Photo" value={fields.heroImage} onChange={(url) => updateFields({ heroImage: url })} />
        </Collapsible>
      )}

      <Collapsible id="ingredients" label={`Ingredients (${fields.ingredients.length})`} openId={open} setOpenId={setOpen}>
        <IngredientsEditor items={fields.ingredients} onChange={(items) => updateFields({ ingredients: items })} config={config} />
      </Collapsible>

      {shared && (
        <Collapsible id="dosage" label="Dosage (shared)" openId={open} setOpenId={setOpen}>
          <div className="grid grid-cols-3 gap-1.5">
            <Input value={fields.dosage.icon} onChange={(e) => updateFields({ dosage: { ...fields.dosage, icon: e.target.value } })} className="text-center text-lg" />
            <Input value={fields.dosage.amount} onChange={(e) => updateFields({ dosage: { ...fields.dosage, amount: e.target.value } })} placeholder="Amount" />
            <Input value={fields.dosage.range} onChange={(e) => updateFields({ dosage: { ...fields.dosage, range: e.target.value } })} placeholder="Range" />
          </div>
        </Collapsible>
      )}

      <Collapsible id="steps" label={`Preparation Steps (${fields.steps.length})`} openId={open} setOpenId={setOpen}>
        <StepsEditor items={fields.steps} onChange={(items) => updateFields({ steps: items })} config={config} addLabel="Add Step" />
      </Collapsible>

      <Collapsible id="storage" label="Storage Note" openId={open} setOpenId={setOpen}>
        <SingleLangField
          label="Storage Note"
          value={fields.storageNote[config.code]}
          onChange={(v) => updateFields({ storageNote: { ...fields.storageNote, [config.code]: v } })}
          config={config}
          multiline
        />
      </Collapsible>

      <Collapsible id="footer" label="Footer Tagline" openId={open} setOpenId={setOpen}>
        <SingleLangField
          label="Tagline"
          value={fields.footerTagline[config.code]}
          onChange={(v) => updateFields({ footerTagline: { ...fields.footerTagline, [config.code]: v } })}
          config={config}
        />
      </Collapsible>

      {shared && (
        <Collapsible id="theme" label="Colors (shared)" openId={open} setOpenId={setOpen}>
          <ColorPickers
            primaryColor={fields.primaryColor}
            backgroundColor={fields.backgroundColor}
            onChangePrimary={(v) => updateFields({ primaryColor: v })}
            onChangeBg={(v) => updateFields({ backgroundColor: v })}
          />
        </Collapsible>
      )}
    </div>
  );
}

// ─── Main FieldPanel export ───────────────────────────────────────────────────

export function FieldPanel({ lang }: { lang: PanelLang }) {
  const { document } = useEditorStore();
  if (!document) return null;

  const fields = document.fields;
  const config = LANG_CONFIG[lang];

  return (
    <div className="h-full overflow-y-auto p-3 flex flex-col gap-1">
      {(document.templateType === "recipe-card" || document.templateType === "extended-recipe") && (
        <RecipeCardPanel fields={fields as RecipeCardFields} config={config} />
      )}
      {document.templateType === "infographic-card" && (
        <InfographicPanel fields={fields as InfographicCardFields} config={config} />
      )}
      {document.templateType === "beverage-card" && (
        <BeveragePanel fields={fields as BeverageCardFields} config={config} />
      )}
    </div>
  );
}
