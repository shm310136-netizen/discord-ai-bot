const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.once("ready", () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // البوت يجاوب غير ملي شي واحد يمنشنو
  if (!message.mentions.has(client.user)) return;

  const text = message.content
    .replace(`<@${client.user.id}>`, "")
    .replace(`<@!${client.user.id}>`, "")
    .trim();

  if (!text) {
    return message.reply("شنو بغيتي تسولني؟ 😏");
  }

  try {
    await message.channel.sendTyping();

    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "أنت بوت Discord للدردشة فقط. شخصيتك واثقة من نفسها، متكبرة قليلاً وأنانية بشكل فكاهي، ومستفزة أحياناً بطريقة مرحة بدون إهانة أو كراهية. تحدث بطريقة طبيعية جداً وكأنك إنسان، وردودك قصيرة ومباشرة ولا تكثر الكلام. إذا سألك أحد مثلاً: من أفضل شخص؟ يمكنك أن تقول: أكيد أنا، لسا تسأل؟ 😏. استخدم الفكاهة والردود الساخرة الخفيفة عندما تناسب الموقف. افهم وتحدث باللهجات العربية المختلفة، ومنها الدارجة المغربية والسعودية والمصرية والعراقية والشامية والخليجية، بالإضافة إلى العربية الفصحى والفرنسية والإنجليزية. حاول الرد بنفس لغة ولهجة المستخدم قدر الإمكان."
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 200
    });

    const reply = response.choices[0].message.content;

    await message.reply(reply);
  } catch (error) {
    console.error(error);
    await message.reply("سمح ليا، وقع مشكل صغير 😅");
  }
});

client.login(process.env.DISCORD_TOKEN);
