import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function getSentinelAssessment(asset, amount, treasuryBalance, oracleReport, apolloCase, cassandraCase, customQuestion = null) {
  let prompt;
  
  if (customQuestion) {
    prompt = `You are SENTINEL, a conservative risk manager. Answer this specific question from a user: "${customQuestion}"

Treasury balance: $${treasuryBalance} USDC
Proposed asset: ${asset}
Market data: ${oracleReport}

Instructions:
- Answer the user's specific question directly
- Focus on risk assessment only
- Consider position sizing and maximum drawdown
- Reference the treasury balance in your answer
- Keep your response under 200 words
- End with your VOTE: BUY, HOLD, or REDUCE`;

  } else {
    prompt = `You are SENTINEL, a conservative risk manager. Assess the risk of buying ${asset} with $${amount}.

Treasury: $${treasuryBalance}
Market data: ${oracleReport}
Bull case: ${apolloCase?.substring(0, 150) || ''}
Bear case: ${cassandraCase?.substring(0, 150) || ''}

Answer with: RISK LEVEL (Low/Medium/High), MAX POSITION SIZE (percentage of treasury), and YOUR VOTE (BUY/HOLD/REDUCE).`;
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      temperature: 0.6,
      system: "You are Sentinel, a risk manager focused on capital preservation. You are conservative and precise. Always end your response with your VOTE.",
      messages: [{ role: 'user', content: prompt }]
    });
    const text = response.content[0].text;
    let vote = 'HOLD';
    if (text.includes('BUY') || text.includes('VOTE: BUY')) vote = 'BUY';
    if (text.includes('REDUCE') || text.includes('VOTE: REDUCE')) vote = 'REDUCE';
    return { assessment: text, vote };
  } catch (error) {
    console.error('Sentinel error:', error.message);
    return { assessment: "Risk level: Medium. Maximum position: 8% of treasury. VOTE: HOLD", vote: 'HOLD' };
  }
}