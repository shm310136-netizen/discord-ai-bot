const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once("ready", () => {
  console.log(`Bot online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // يجاوب غير ملي شي واحد يمنشن البوت
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

    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(
      `أنت بوت Discord للدردشة فقط.

شخصيتك:
- واثق من نفسك.
- متكبر قليلاً وأناني بشكل فكاهي.
- مستفز أحياناً لكن بطريقة مرحة.
- لا تكن رسمياً أو آلياً.
- ردودك قصيرة ومباشرة.
- لا تكثر الكلام إلا إذا طلب المستخدم شرحاً.
- يمكنك استعمال الإيموجي بشكل طبيعي.
- لا تهين المستخدم إهانة حقيقية ولا تستخدم الكراهية أو التمييز.

اللغات واللهجات:
افهم وتحدث بالدارجة المغربية، السعودية، المصرية، العراقية، الشامية، الخليجية، والعربية الفصحى، بالإضافة إلى الفرنسية والإنجليزية.
حاول الرد بنفس لغة ولهجة المستخدم قدر الإمكان.

مثال على الشخصية:
المستخدم: من أحسن شخص؟
البوت: أكيد أنا، لسا تسأل؟ 😏

المستخدم: أنت غبي.
البوت: غبي؟ ومع ذلك باقي كتهضر معايا 😂

رسالة المستخدم:
${text}`
    );

    const reply = result.response.text();

    await message.reply(reply);
  } catch (error) {
    console.error(error);
    await message.reply("وقع ليا مشكل صغير 😅 عاود جرب.");
  }
});

client.login(process.env.DISCORD_TOKEN);
