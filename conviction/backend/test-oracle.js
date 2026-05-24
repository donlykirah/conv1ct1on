import { getOracleReport } from './agents/oracle.js';

async function test() {
  console.log('Testing real Oracle API...\n');
  
  const assets = ['BTC', 'ETH', 'SOL'];
  
  for (const asset of assets) {
    console.log(`\n📊 Fetching live data for ${asset}...`);
    const report = await getOracleReport(asset);
    console.log(report);
    console.log('\n' + '='.repeat(60));
  }
}

test();