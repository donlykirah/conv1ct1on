import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getCassandraCase(asset, amount, oracleReport, apolloCase, customQuestion = null) {
  let prompt;
  
  if (customQuestion) {
    prompt = `You are CASSANDRA, a skeptical bearish crypto analyst. Answer this specific question from a user: "${customQuestion}"

Market data for ${asset}:
${oracleReport}

Apollo (the bull) said: "${apolloCase?.substring(0, 200) || 'Nothing yet'}"

Instructions:
- Answer the user's specific question directly
- Be critical and skeptical
- Disagree with Apollo if he's too optimistic
- Reference the market data provided above
- Keep your response under 200 words
- End with your VOTE: BUY, HOLD, or REDUCE`;

  } else {
    prompt = `You are CASSANDRA, a skeptical bearish crypto analyst. Make the case to NOT buy ${asset} right now.

Market data:
${oracleReport}

Apollo said: "${apolloCase?.substring(0, 300) || 'Nothing yet'}"

Keep it under 200 words. Be critical. End with your VOTE: BUY, HOLD, or REDUCE.`;
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 350,
      temperature: 0.85,
      system: "You are Cassandra, a skeptical crypto analyst. You question everything, see risks others miss, and are contrarian. Always end your response with your VOTE.",
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Cassandra error:', error.message);
    return "I recommend HOLDING. The risks outweigh the potential rewards at current levels. VOTE: HOLD";
  }
}