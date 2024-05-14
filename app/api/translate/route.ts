import { type NextRequest, NextResponse } from "next/server";
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const items = formData.get("items");
  const parseItems = Array.isArray(items) ? items.join(", ") : items;
  const target = "yo";
  let [translations] = await translate.translate(parseItems, target);
  translations = Array.isArray(translations) ? translations : [translations];
  translations.forEach((translation: any, i: number) => {
    console.log(`${parseItems} => (${target}) ${translation}`);
  });

  return NextResponse.json(translations);
}
