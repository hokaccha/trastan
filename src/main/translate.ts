import { OpenAI } from "openai";
import * as path from "node:path";
import { app } from "electron";
import * as fs from "node:fs/promises";

const prompt = `
  あなたはプロの翻訳家です。入力された文章が英語であれば日本語に、日本語であれば英語に翻訳してください。
`;

export async function translate(text: string): Promise<string> {
  const configFilePath = path.join(app.getPath("userData"), "setting.json");
  const json = await fs.readFile(configFilePath, "utf8");
  const setting = JSON.parse(json);

  const openai = new OpenAI({
    apiKey: setting.OPEN_AI_API_KEY,
    organization: setting.OPEN_AI_ORG_ID,
  });
  const result = await openai.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
    model: "gpt-4o",
    stream: false,
  });
  return result.choices[0].message.content || "";
}
