const fs = require('fs');

const env = `export const environment = {
  production: true,
  supabase: {
    api_url: '${process.env.SUPABASE_URL}',
    api_key: '${process.env.SUPABASE_KEY}'
  },
  telegram: {
    bot_token: '${process.env.TELEGRAM_BOT_TOKEN}',
    verification_bot: '${process.env.TELEGRAM_VERIFICATION_BOT}'
  }
};
`;

fs.mkdirSync('./src/environments', { recursive: true });
fs.writeFileSync('./src/environments/environment.ts', env);
console.log('✅ environment.ts created');