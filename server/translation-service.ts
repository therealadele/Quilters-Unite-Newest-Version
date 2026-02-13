import { db } from "./db";
import { contentTranslations } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const SUPPORTED_LANGUAGES = ["en", "fr", "es", "de", "nl", "da", "ja"];

interface TranslateResult {
  language: string;
  translatedText: string;
}

async function translateWithGoogle(
  text: string,
  sourceLang: string,
  targetLangs: string[]
): Promise<TranslateResult[]> {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_CLOUD_API_KEY not set, skipping translation");
    return [];
  }

  const results: TranslateResult[] = [];

  for (const targetLang of targetLangs) {
    if (targetLang === sourceLang) continue;

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: "text",
          }),
        }
      );

      if (!response.ok) {
        console.error(`Translation failed for ${targetLang}:`, await response.text());
        continue;
      }

      const data = await response.json();
      const translatedText = data.data?.translations?.[0]?.translatedText;
      if (translatedText) {
        results.push({ language: targetLang, translatedText });
      }
    } catch (error) {
      console.error(`Translation error for ${targetLang}:`, error);
    }
  }

  return results;
}

async function upsertTranslation(
  contentType: string,
  contentId: string,
  field: string,
  language: string,
  translatedText: string,
  sourceLanguage: string
): Promise<void> {
  const existing = await db
    .select()
    .from(contentTranslations)
    .where(
      and(
        eq(contentTranslations.contentType, contentType),
        eq(contentTranslations.contentId, contentId),
        eq(contentTranslations.field, field),
        eq(contentTranslations.language, language)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(contentTranslations)
      .set({ translatedText, updatedAt: new Date() })
      .where(eq(contentTranslations.id, existing[0].id));
  } else {
    await db.insert(contentTranslations).values({
      contentType,
      contentId,
      field,
      language,
      translatedText,
      sourceLanguage,
    });
  }
}

export async function translateContent(
  contentType: string,
  contentId: string,
  fields: Record<string, string>,
  sourceLanguage: string = "en"
): Promise<void> {
  const targetLangs = SUPPORTED_LANGUAGES.filter((l) => l !== sourceLanguage);

  for (const [field, text] of Object.entries(fields)) {
    if (!text || text.trim() === "") continue;

    await upsertTranslation(contentType, contentId, field, sourceLanguage, text, sourceLanguage);

    const translations = await translateWithGoogle(text, sourceLanguage, targetLangs);

    for (const { language, translatedText } of translations) {
      await upsertTranslation(contentType, contentId, field, language, translatedText, sourceLanguage);
    }
  }
}

export async function getTranslatedContent(
  contentType: string,
  contentId: string,
  language: string
): Promise<Record<string, string>> {
  const translations = await db
    .select()
    .from(contentTranslations)
    .where(
      and(
        eq(contentTranslations.contentType, contentType),
        eq(contentTranslations.contentId, contentId),
        eq(contentTranslations.language, language)
      )
    );

  const result: Record<string, string> = {};
  for (const t of translations) {
    result[t.field] = t.translatedText;
  }
  return result;
}

export async function getTranslatedContents(
  contentType: string,
  contentIds: string[],
  language: string
): Promise<Map<string, Record<string, string>>> {
  if (contentIds.length === 0 || language === "en") {
    return new Map();
  }

  const translations = await db
    .select()
    .from(contentTranslations)
    .where(
      and(
        eq(contentTranslations.contentType, contentType),
        eq(contentTranslations.language, language)
      )
    );

  const idSet = new Set(contentIds);
  const result = new Map<string, Record<string, string>>();

  for (const t of translations) {
    if (!idSet.has(t.contentId)) continue;
    if (!result.has(t.contentId)) {
      result.set(t.contentId, {});
    }
    result.get(t.contentId)![t.field] = t.translatedText;
  }

  return result;
}
