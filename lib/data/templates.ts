import type {
  TemplateDefinition,
  RecipeCardFields,
  InfographicCardFields,
  BeverageCardFields,
  DocumentSection,
  InstructionStep,
} from "../types";

// ─── A4 dimensions at 96dpi ───────────────────────────────────────────────────
export const A4_PORTRAIT = { width: 794, height: 1123, orientation: "portrait" as const, format: "A4" as const };
export const A4_LANDSCAPE = { width: 1123, height: 794, orientation: "landscape" as const, format: "A4" as const };

// ─── Default fields ───────────────────────────────────────────────────────────
// Every default stamps a `themeId` so every document resolves the correct
// preset out-of-the-box (no more orange-beverage-header bug).

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
    { id: "s6", icon: "❄️", text: { en: "Let cool completely before glazing.", ar: "اتركها تبرد تماماً قبل التزيين." } },
    { id: "s7", icon: "✨", text: { en: "Dust with powdered sugar and serve.", ar: "رشّها بالسكر الناعم وقدّمها." } },
  ],
  sideNote: {
    en: "For closer cuts, use your knife under hot water and wipe dry before slicing.",
    ar: "للحصول على قطع أنظف، استخدم سكيناً دافئاً ونشّفه قبل التقطيع.",
  },
  sections: [],
  badgeText: { en: "ENJOY EVERY BITE !", ar: "استمتع بكل قضمة" },
  tagline: { en: "Creativity with Confidence", ar: "ابدع بثقة" },
  products: [],
  primaryColor: "",
  backgroundColor: "",
  themeId: "egnite-recipe-card",
};

const defaultInfographicFields: InfographicCardFields = {
  language: "en",
  title: { en: "Biscuit Filling", ar: "حشوة البسكويت" },
  prepTime: "11 minutes",
  heroImage: "",
  ingredients: [
    { id: "i1", icon: "🧈", label: { en: "Butter: 1 stick (100g)", ar: "زبدة: عود واحد (100غ)" }, amount: "" },
    { id: "i2", icon: "🍯", label: { en: "Ghee (samneh): ½ cup (100g)", ar: "سمنة: ½ كوب (100غ)" }, amount: "" },
    { id: "i3", icon: "🍚", label: { en: "Powder Sugar: 2 cups (290g)", ar: "سكر ناعم: كوبان (290غ)" }, amount: "" },
    { id: "i4", icon: "💧", label: { en: "Water: 5 tsp (25g)", ar: "ماء: 5 ملاعق صغيرة (25غ)" }, amount: "" },
    { id: "i5", icon: "🧪", label: { en: "Flavor (Essence): ¼ tsp (1.25g)", ar: "جوهر: ¼ ملعقة صغيرة (1.25غ)" }, amount: "" },
    { id: "i6", icon: "⚖️", label: { en: "Total weight: 516.25g", ar: "الوزن الإجمالي: 516.25غ" }, amount: "" },
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
  footerTagline: { en: "Creativity with Confidence", ar: "ابدع بثقة" },
  primaryColor: "",
  backgroundColor: "",
  themeId: "egnite-infographic",
};

const defaultBeverageFields: BeverageCardFields = {
  language: "en",
  headerPill: { en: "CARBONATED", ar: "غازي" },
  title: { en: "Carbonated Beverage", ar: "مشروب غازي" },
  subtitle: { en: "Preparation Guide", ar: "دليل التحضير" },
  heroImage: "",
  ingredients: [
    { id: "i1", icon: "💧", label: { en: "Water", ar: "ماء" }, amount: "1,000.00g", quantity: "1 ltr", weight: "1,000.00g" },
    { id: "i2", icon: "🍚", label: { en: "Sugar", ar: "سكر" }, amount: "112.50g", quantity: "½ cup", weight: "112.50g" },
    { id: "i3", icon: "🍋", label: { en: "Citric Acid", ar: "حمض الستريك" }, amount: "2.50g", quantity: "½ tsp", weight: "2.50g" },
    { id: "i4", icon: "🧪", label: { en: "Flavor", ar: "نكهة" }, amount: "0.60g", quantity: "19 drops", weight: "0.60g" },
  ],
  dosage: { icon: "🧪", amount: "1.25g per liter", range: "0.10% – 0.15%" },
  dosageStarting: {
    label: { en: "Starting Dose", ar: "جرعة الانطلاق" },
    value: "1.0g",
    icon: "🟢",
  },
  dosageQuick: {
    label: { en: "Quick Dose", ar: "جرعة سريعة" },
    value: "0.5g",
    icon: "⚡",
  },
  dosageRange: {
    label: { en: "Dosage Range", ar: "نطاق الجرعة" },
    value: "0.04% – 0.08%",
    icon: "📏",
  },
  steps: [
    { id: "s1", icon: "🫙", text: { en: "Add water, sugar, and citric acid to a jug", ar: "أضف الماء والسكر وحمض الستريك إلى إبريق" } },
    { id: "s2", icon: "🥄", text: { en: "Stir well for 2–3 minutes", ar: "امزج جيداً لمدة 2-3 دقائق" } },
    { id: "s3", icon: "🧪", text: { en: "Add 19 drops Egnite Essence (hide dots) and color drops as needed", ar: "أضف 19 قطرة من جوهر إيغنايت وقطرات اللون حسب الحاجة" } },
    { id: "s4", icon: "💧", text: { en: "Stir well until fully dissolved", ar: "امزج جيداً حتى يذوب بالكامل" } },
    { id: "s5", icon: "🍾", text: { en: "Pour the mixture into the carbonation machine bottle", ar: "اسكب الخليط في زجاجة مكينة الغاز" } },
    { id: "s6", icon: "⏱️", text: { en: "Twist the carbonation lever 3 times to release the gas", ar: "أدر رافعة الغاز 3 مرات لإطلاقه" } },
  ],
  storageNote: {
    en: "The beverage can be stored for up to 36 hours if refrigerated. Best placed away from direct sunlight. Rests before 2 years from production date.",
    ar: "يمكن تخزين المشروب حتى 36 ساعة في الثلاجة. الأفضل تخزينه بعيداً عن أشعة الشمس المباشرة.",
  },
  footerTagline: { en: "Creativity with Confidence", ar: "ابدع بثقة" },
  primaryColor: "",
  backgroundColor: "",
  themeId: "egnite-beverage-card",
};

// ─── Extended Recipe default — sub-recipe sections render as full blocks ─────

const extSubRecipe = (
  id: string,
  title: { en: string; ar: string },
  items: { id: string; icon: string; label: { en: string; ar: string }; amount: string }[],
  steps: InstructionStep[],
): DocumentSection => ({
  id,
  title,
  type: "sub-recipe",
  items,
  steps,
});

const defaultExtendedRecipeFields: RecipeCardFields = {
  ...defaultRecipeFields,
  title: { en: "Strawberry Short Cake Cups", ar: "كؤوس كيك الفراولة" },
  subtitle: { en: "Layered cups with vanilla sponge, strawberry compote and whipped cream.", ar: "كؤوس متعددة الطبقات من كيك الفانيليا وكومبوت الفراولة والكريمة المخفوقة." },
  sections: [
    extSubRecipe(
      "ext-sec-1",
      { en: "Chocolate Coating", ar: "طبقة الشوكولاتة" },
      [
        { id: "e1", icon: "🍫", label: { en: "Dark Chocolate", ar: "شوكولاتة داكنة" }, amount: "200g" },
        { id: "e2", icon: "🧈", label: { en: "Coconut Oil", ar: "زيت جوز الهند" }, amount: "1 tbsp" },
      ],
      [
        { id: "es1", icon: "🫕", text: { en: "Melt chocolate and coconut oil together.", ar: "اذوب الشوكولاتة مع زيت جوز الهند." } },
        { id: "es2", icon: "🥄", text: { en: "Pour over the cooled cake base.", ar: "اسكبها فوق قاعدة الكيك الباردة." } },
      ],
    ),
    extSubRecipe(
      "ext-sec-2",
      { en: "Vanilla Frosting", ar: "كريمة الفانيليا" },
      [
        { id: "e3", icon: "🧈", label: { en: "Butter (softened)", ar: "زبدة مليّنة" }, amount: "125g" },
        { id: "e4", icon: "🍚", label: { en: "Icing Sugar", ar: "سكر ناعم" }, amount: "250g" },
        { id: "e5", icon: "🧪", label: { en: "Vanilla Essence", ar: "جوهر الفانيليا" }, amount: "¼ tsp" },
      ],
      [
        { id: "es3", icon: "🥣", text: { en: "Beat butter until pale.", ar: "اخفق الزبدة حتى تصبح شاحبة." } },
        { id: "es4", icon: "❄️", text: { en: "Sift in icing sugar and essence, whip to stiff peaks.", ar: "أضف السكر الناعم والجوهر واخفق حتى التماسك." } },
      ],
    ),
  ],
  themeId: "egnite-extended-recipe",
};

// ─── Template Definitions ─────────────────────────────────────────────────────

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "recipe-card",
    name: { en: "Recipe Card", ar: "بطاقة وصفة" },
    description: {
      en: "A4 portrait card — inline hero, numbered 2-column instructions, orange ENJOY EVERY BITE stamp. Matches the handcrafted recipe samples.",
      ar: "بطاقة A4 عمودية — صورة رئيسية داخلية، تعليمات مرقمة بعمودين، وطابع البرتقال.",
    },
    thumbnail: "/templates/recipe-card-thumb.png",
    dimensions: A4_PORTRAIT,
    defaultFields: defaultRecipeFields,
  },
  {
    id: "infographic-card",
    name: { en: "Infographic Card", ar: "بطاقة إنفوغرافيك" },
    description: {
      en: "A4 landscape infographic — centered gold title, three-column body (ingredients · hero + dosage · steps), charcoal footer with social.",
      ar: "بطاقة A4 أفقية — عنوان ذهبي مركزي، جسم بثلاثة أعمدة، تذييل داكن بأيقونات اجتماعية.",
    },
    thumbnail: "/templates/infographic-card-thumb.png",
    dimensions: A4_LANDSCAPE,
    defaultFields: defaultInfographicFields,
  },
  {
    id: "beverage-card",
    name: { en: "Beverage Guide", ar: "دليل المشروبات" },
    description: {
      en: "A4 landscape — charcoal banner header with centered pill, 4-column ingredient table, tri-dose block, horizontal step flow, charcoal footer.",
      ar: "بطاقة A4 أفقية — ترويسة داكنة ولوحة جرعة ثلاثية وتدفق خطوات أفقي.",
    },
    thumbnail: "/templates/beverage-card-thumb.png",
    dimensions: A4_LANDSCAPE,
    defaultFields: defaultBeverageFields,
  },
  {
    id: "extended-recipe",
    name: { en: "Extended Recipe", ar: "وصفة موسّعة" },
    description: {
      en: "A4 portrait — orange accent header, full-page hero, full-width sub-recipe blocks (coating, frosting, filling) each with its own ingredients + numbered steps.",
      ar: "بطاقة A4 عمودية — ترويسة برتقالية وصورة رئيسية كاملة وكتل وصفات فرعية.",
    },
    thumbnail: "/templates/extended-recipe-thumb.png",
    dimensions: A4_PORTRAIT,
    defaultFields: defaultExtendedRecipeFields,
  },
];

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/** Map a templateType to its canonical theme id. Used by seed + migrate. */
export const TEMPLATE_THEME_ID: Record<string, string> = {
  "recipe-card": "egnite-recipe-card",
  "infographic-card": "egnite-infographic",
  "beverage-card": "egnite-beverage-card",
  "extended-recipe": "egnite-extended-recipe",
};
