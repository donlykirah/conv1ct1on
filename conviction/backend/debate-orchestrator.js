import { getOracleReport } from './agents/oracle.js';
import { getApolloCase } from './agents/apollo.js';
import { getCassandraCase } from './agents/cassandra.js';
import { getSentinelAssessment } from './agents/sentinel.js';

export async function runDebate(asset = 'BTC', amount = 2000, treasuryBalance = 10, customQuestion = null) {
  const debateId = Date.now().toString();
  
  console.log(`\n🎭 [DEBATE] ========================================`);
  console.log(`🎭 [DEBATE] Starting for ${asset}`);
  if (customQuestion) console.log(`📝 [DEBATE] Custom question: "${customQuestion}"`);
  console.log(`🎭 [DEBATE] ========================================\n`);
  
  try {
    console.log(`📊 [ORACLE] Fetching market data...`);
    const oracleReport = await getOracleReport(asset, amount);
    console.log(`✅ [ORACLE] Market data ready\n`);
    
    console.log(`🤖 [APOLLO] Calling Claude API...`);
    const apolloStart = Date.now();
    const apolloCase = await getApolloCase(asset, amount, oracleReport, customQuestion);
    console.log(`✅ [APOLLO] Response received in ${Date.now() - apolloStart}ms\n`);
    
    console.log(`🤖 [CASSANDRA] Calling Claude API...`);
    const cassandraStart = Date.now();
    const cassandraCase = await getCassandraCase(asset, amount, oracleReport, apolloCase, customQuestion);
    console.log(`✅ [CASSANDRA] Response received in ${Date.now() - cassandraStart}ms\n`);
    
    console.log(`🤖 [SENTINEL] Calling Claude API...`);
    const sentinelStart = Date.now();
    const { assessment: sentinelCase, vote: sentinelVote } = await getSentinelAssessment(
      asset, amount, treasuryBalance, oracleReport, apolloCase, cassandraCase, customQuestion
    );
    console.log(`✅ [SENTINEL] Response received in ${Date.now() - sentinelStart}ms\n`);
    
    const steps = [
      { agent: 'ORACLE', content: oracleReport, vote: null },
      { agent: 'APOLLO', content: apolloCase, vote: apolloCase.includes('BUY') ? 'BUY' : 'HOLD' },
      { agent: 'CASSANDRA', content: cassandraCase, vote: cassandraCase.includes('BUY') ? 'BUY' : 'HOLD' },
      { agent: 'SENTINEL', content: sentinelCase, vote: sentinelVote }
    ];
    
    const votes = { BUY: 0, HOLD: 0, REDUCE: 0 };
    steps.forEach(step => {
      if (step.vote === 'BUY') votes.BUY++;
      if (step.vote === 'HOLD') votes.HOLD++;
      if (step.vote === 'REDUCE') votes.REDUCE++;
    });
    
    const decision = votes.BUY >= 2 ? 'BUY' : votes.REDUCE >= 2 ? 'REDUCE' : 'HOLD';
    const allocationPercent = decision === 'BUY' ? 8 : 0;
    const txHash = decision === 'BUY' ? `0x${Math.random().toString(36).substring(2, 15)}${Date.now().toString(16)}` : null;
    
    console.log(`✅ [DEBATE] ========================================`);
    console.log(`✅ [DEBATE] Complete! Decision: ${decision}`);
    console.log(`✅ [DEBATE] Votes: BUY:${votes.BUY} HOLD:${votes.HOLD} REDUCE:${votes.REDUCE}`);
    console.log(`✅ [DEBATE] ========================================\n`);
    
    return { debateId, asset, amount, decision, allocationPercent, votes, steps, txHash, timestamp: new Date().toISOString() };
    
  } catch (error) {
    console.error('❌ Debate error:', error);
    throw error;
  }
}
