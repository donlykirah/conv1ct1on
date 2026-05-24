import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testClaude() {
  console.log('🔑 Testing Claude API...');
  console.log(`📝 API Key exists: ${!!process.env.ANTHROPIC_API_KEY}`);
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 50,
      messages: [{ role: 'user', content: 'Say "Claude API is working!"' }]
    });
    
    console.log('✅ SUCCESS!');
    console.log(`📝 Response: ${response.content[0].text}`);
    
  } catch (error) {
    console.error('❌ FAILED:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Status: ${error.status}`);
    if (error.status === 401) console.error('   → Invalid API key');
    if (error.status === 404) console.error('   → Model not found. Check model name.');
  }
}

testClaude();