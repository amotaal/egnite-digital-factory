import type {
  TemplateDefinition,
  RecipeCardFields,
  InfographicCardFields,
  BeverageCardFields,
} from "../types";

// ─── A4 dimensions at 96dpi ───────────────────────────────────────────────────
export const A4_PORTRAIT = { width: 794, height: 1123, orientation: "portrait" as const, format: "A4" as const };
export const A4_LANDSCAPE = { width: 1123, height: 794, orientation: "landscape" as const, format: "A4" as const };

// ─── Default fields ───────────────────────────────────────────────────────────

const defaultRecipeFields: RecipeCardFields = {
  language: "en",
  logoText: "EGNITE",
  heroImage: "",
  title: { en: "Recipe Name", ar: "اسم الوصفة" },
  subtitle: { en: "A delicious creation with Egnite flavors", ar: "إبداع لذيذ بنكهات إيغنايت" },
  prepTime: "15 mins",
  cookTime: "30 mins",
  servings: "12 pieces",
  difficulty: "Medium",
  ingredients: [
    { id: "i1", icon: "🧈", label: { en: "Butter", ar: "زبدة" }, amount: "100g" },
    { id: "i2", icon: "🍚", label: { en: "Sugar", ar: "سكر" }, amount: "150g" },
    { id: "i3", icon: "🌾", label: { en: "Flour", ar: "دقيق" }, amount: "200g" },
    { id: "i4", icon: "🥚", label: { en: "Eggs", ar: "بيض" }, amount: "2 large" },
    { id: "i5", icon: "🧪", label: { en: "Egnite Essence", ar: "جوهر إيغنايت" }, amount: "¼ tsp (1.25g)" },
  ],
  instructions: [
    { id: "s1", icon: "🥣", text: { en: "Cream together butter and sugar until light and fluffy.", ar: "اخفق الزبدة والسكر حتى يصبح خفيفاً وهشاً." } },
    { id: "s2", icon: "🥚", text: { en: "Add eggs one at a time, beating well after each.", ar: "أضف البيض واحدة تلو الأخرى مع الخفق الجيد." } },
    { id: "s3", icon: "🧪", text: { en: "Add Egnite Essence and mix until combined.", ar: "أضف جوهر إيغنايت وامزج حتى يتجانس." } },
    { id: "s4", icon: "🌾", text: { en: "Fold in flour until just combined — do not over-mix.", ar: "أضف الدقيق برفق حتى يتجانس، لا تمزج كثيراً." } },
    { id: "s5", icon: "🫙", text: { en: "Bake at 180°C for 20–25 minutes until golden.", ar: "اخبز على 180°م لمدة 20-25 دقيقة حتى يصبح ذهبياً." } },
  ],
  sections: [],
  badgeText: { en: "ENJOY EVERY BITE", ar: "استمتع بكل قضمة" },
  tagline: { en: "Creativity with Confidence", ar: "إبداع بثقة" },
  products: [],
  primaryColor: "#B78D4B",
  backgroundColor: "#FCFAF4",
};

const defaultInfographicFields: InfographicCardFields = {
  language: "en",
  title: { en: "Recipe Name", ar: "اسم الوصفة" },
  prepTime: "11 minutes",
  heroImage: "",
  ingredients: [
    { id: "i1", icon: "🧈", label: { en: "Butter: 1 stick", ar: "زبدة: عود واحد" }, amount: "100g" },
    { id: "i2", icon: "🍯", label: { en: "Ghee (samneh)", ar: "سمنة" }, amount: "½ cup (100g)" },
    { id: "i3", icon: "🍚", label: { en: "Powder Sugar", ar: "سكر ناعم" }, amount: "2 cups (290g)" },
    { id: "i4", icon: "🥛", label: { en: "Water", ar: "ماء" }, amount: "5 tsp (25g)" },
    { id: "i5", icon: "🧪", label: { en: "Egnite Essence", ar: "جوهر إيغنايت" }, amount: "¼ tsp (1.25g)" },
  ],
  dosageEssence: { icon: "🧪", amount: "1.25g (¼ tsp)", range: "0.25% – 0.30%" },
  dosageEmulsion: { icon: "🧴", amount: "1.75g (½ tsp)", range: "0.35% – 0.50%" },
  instructions: [
    { id: "s1", icon: "🥣", text: { en: "Mix butter, ghee, and water", ar: "امزج الزبدة والسمنة والماء" } },
    { id: "s2", icon: "🧂", text: { en: "Gradually add powdered sugar", ar: "أضف السكر الناعم تدريجياً" } },
    { id: "s3", icon: "🧪", text: { en: "Add Egnite Essence and color drops", ar: "أضف جوهر إيغنايت وقطرات اللون" } },
    { id: "s4", icon: "🧑‍🍳", text: { en: "Mix for 1–2 minutes", ar: "امزج لمدة 1-2 دقيقة" } },
    { id: "s5", icon: "🥄", text: { en: "Use as needed", ar: "استخدم حسب الحاجة" } },
  ],
  footerTagline: { en: "Creativity with Confidence", ar: "إبداع بثقة" },
  primaryColor: "#B78D4B",
  backgroundColor: "#FCFAF4",
};

const defaultBeverageFields: BeverageCardFields = {
  language: "en",
  title: { en: "Beverage Name", ar: "اسم المشروب" },
  subtitle: { en: "Preparation Guide", ar: "دليل التحضير" },
  heroImage: "",
  ingredients: [
    { id: "i1", icon: "💧", label: { en: "Carbonated Water", ar: "ماء غازي" }, amount: "330ml" },
    { id: "i2", icon: "🍚", label: { en: "Sugar Syrup", ar: "شراب سكر" }, amount: "40ml" },
    { id: "i3", icon: "🧊", label: { en: "Ice", ar: "جليد" }, amount: "as needed" },
    { id: "i4", icon: "🧪", label: { en: "Egnite Essence", ar: "جوهر إيغنايت" }, amount: "¼ tsp (1.25g)" },
  ],
  dosage: { icon: "🧪", amount: "1.25g per liter", range: "0.10% – 0.15%" },
  steps: [
    { id: "s1", icon: "🧊", text: { en: "Fill glass with ice", ar: "املأ الكأس بالجليد" } },
    { id: "s2", icon: "🍚", text: { en: "Add sugar syrup", ar: "أضف شراب السكر" } },
    { id: "s3", icon: "🧪", text: { en: "Add Egnite Essence", ar: "أضف جوهر إيغنايت" } },
    { id: "s4", icon: "💧", text: { en: "Top with carbonated water and stir gently", ar: "أكمل بالماء الغازي وحرّك برفق" } },
  ],
  storageNote: { en: "Store essence in a cool, dry place away from direct sunlight. Best before 2 years from production date.", ar: "احفظ الجوهر في مكان بارد وجاف بعيداً عن ضوء الشمس المباشر. الأفضل قبل سنتين من تاريخ الإنتاج." },
  footerTagline: { en: "Creativity with Confidence", ar: "إبداع بثقة" },
  primaryColor: "#B78D4B",
  backgroundColor: "#FCFAF4",
};

// ─── Template Definitions ─────────────────────────────────────────────────────

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "recipe-card",
    name: { en: "Recipe Card", ar: "بطاقة وصفة" },
    description: {
      en: "A4 portrait card with hero image, ingredients, step-by-step instructions, and optional sub-sections. Perfect for baked goods, desserts, and confections.",
      ar: "بطاقة A4 عمودية بصورة رئيسية ومكونات وتعليمات خطوة بخطوة وأقسام اختيارية. مثالية للمخبوزات والحلويات.",
    },
    thumbnail: "/templates/recipe-card-thumb.png",
    dimensions: A4_PORTRAIT,
    defaultFields: defaultRecipeFields,
  },
  {
    id: "infographic-card",
    name: { en: "Infographic Card", ar: "بطاقة إنفوغرافيك" },
    description: {
      en: "A4 landscape card with three-column layout: ingredients with icons, hero image with dosage table, and step-by-step instructions. Great for biscuit fillings, frostings, and confectionery.",
      ar: "بطاقة A4 أفقية بتخطيط ثلاثة أعمدة: مكونات بأيقونات، صورة رئيسية مع جدول الجرعة، وتعليمات. مثالية لحشوات البسكويت والفروستنج.",
    },
    thumbnail: "/templates/infographic-card-thumb.png",
    dimensions: A4_LANDSCAPE,
    defaultFields: defaultInfographicFields,
  },
  {
    id: "beverage-card",
    name: { en: "Beverage Guide", ar: "دليل المشروبات" },
    description: {
      en: "A4 landscape card with dark header, ingredients table, dosage box, and horizontal preparation steps. Ideal for carbonated drinks, syrups, and specialty beverages.",
      ar: "بطاقة A4 أفقية بترويسة داكنة وجدول مكونات وجرعات وخطوات تحضير أفقية. مثالية للمشروبات الغازية والشراب.",
    },
    thumbnail: "/templates/beverage-card-thumb.png",
    dimensions: A4_LANDSCAPE,
    defaultFields: defaultBeverageFields,
  },
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
