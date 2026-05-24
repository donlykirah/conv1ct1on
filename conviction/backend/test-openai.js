import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  console.log('🔑 Testing OpenAI API Key...');
  console.log(`📝 API Key exists: ${!!process.env.OPENAI_API_KEY}`);
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'user', content: 'Say "API is working!" in under 10 words.' }
      ],
      max_tokens: 20,
    });
    
    console.log('✅ SUCCESS!');
    console.log(`📝 Response: ${response.choices[0].message.content}`);
    console.log(`💰 Tokens used: ${response.usage.total_tokens}`);
    
  } catch (error) {
    console.error('❌ FAILED:');
    console.error(`   Error: ${error.message}`);
    if (error.status === 401) {
      console.error('   → Invalid API key. Check your OPENAI_API_KEY in .env');
    }
    if (error.status === 429) {
      console.error('   → Rate limit or quota exceeded. Add payment method.');
    }
  }
}

testOpenAI();