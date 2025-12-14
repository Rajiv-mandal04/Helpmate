import OpenAI from "openai";

async function test() {
  const client = new OpenAI({ apiKey: "sk-xxxxx" });

  try {
    const res = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello" }],
    });

    console.log(res.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

test();
