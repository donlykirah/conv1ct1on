import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getApolloCase(asset, amount, oracleReport, customQuestion = null) {
  let prompt;
  
  if (customQuestion) {
    prompt = `You are APOLLO, a bullish crypto analyst. Answer this specific question from a user: "${customQuestion}"

Market data for ${asset}:
${oracleReport}

Instructions:
- Answer the user's specific question directly
- Reference the market data provided above
- Keep your response under 200 words
- Be persuasive and bullish
- End with your VOTE: BUY, HOLD, or REDUCE`;

  } else {
    prompt = `You are APOLLO, a bullish crypto analyst. Make the case to BUY ${asset} with $${amount}.

Market data:
${oracleReport}

Keep it under 200 words. Be persuasive. End with your VOTE: BUY, HOLD, or REDUCE.`;
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 350,
      temperature: 0.8,
      system: "You are Apollo, a bullish crypto analyst. You are persuasive, data-driven, and optimistic. Always end your response with your VOTE.",
      messages: [{ role: 'user', content: prompt }]
    });
    return response.content[0].text;
  } catch (error) {
    console.error('Apollo error:', error.message);
    return "Based on the data, I recommend BUYING. Momentum is strong and the risk/reward is favorable. VOTE: BUY";
  }
}