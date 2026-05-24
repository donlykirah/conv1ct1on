import React from 'react';

function TreasuryPanel({ balance, currentDebate, history }) {
  const getVoteCounts = () => {
    if (!currentDebate) return { BUY: 0, HOLD: 0, REDUCE: 0 };
    return currentDebate.votes || { BUY: 0, HOLD: 0, REDUCE: 0 };
  };

  const votes = getVoteCounts();
  const totalVotes = votes.BUY + votes.HOLD + votes.REDUCE;
  const buyPercent = totalVotes > 0 ? (votes.BUY / totalVotes) * 100 : 0;
  const holdPercent = totalVotes > 0 ? (votes.HOLD / totalVotes) * 100 : 0;
  const reducePercent = totalVotes > 0 ? (votes.REDUCE / totalVotes) * 100 : 0;

  return (
    <div className="p-4 lg:p-6 space-y-5">
      {/* Treasury Card */}
      <div className="bg-gradient-to-br from-bull/5 to-quant/5 rounded-2xl p-5 text-center border border-bull/20">
        <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-2">TREASURY</h3>
        <div className="text-2xl font-bold font-mono text-bull">
          ${balance.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">USDC on Arc</div>
        <div className="inline-block mt-3 px-3 py-1 bg-dark-200 rounded-full text-xs font-mono">
          ⚡ Arc L1
        </div>
      </div>

      {/* Vote Tally */}
      <div className="bg-dark-200 rounded-xl p-4">
        <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">VOTE TALLY</h3>
        
        {!currentDebate ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No active debate
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-bull font-semibold">🟢 BUY</span>
                <span>{votes.BUY}</span>
              </div>
              <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                <div className="h-full bg-bull rounded-full transition-all duration-500" style={{ width: `${buyPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-semibold">⏸ HOLD</span>
                <span>{votes.HOLD}</span>
              </div>
              <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 rounded-full transition-all duration-500" style={{ width: `${holdPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-bear font-semibold">🔴 REDUCE</span>
                <span>{votes.REDUCE}</span>
              </div>
              <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                <div className="h-full bg-bear rounded-full transition-all duration-500" style={{ width: `${reducePercent}%` }} />
              </div>
            </div>
            
            {currentDebate.decision && (
              <div className="mt-4 pt-3 border-t border-gray-800">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">DECISION</div>
                  <div className={`font-bold text-lg ${
                    currentDebate.decision === 'BUY' ? 'text-bull' : 
                    currentDebate.decision === 'REDUCE' ? 'text-bear' : 'text-gray-400'
                  }`}>
                    {currentDebate.decision === 'BUY' && '🟢 BUY'}
                    {currentDebate.decision === 'HOLD' && '⏸ HOLD'}
                    {currentDebate.decision === 'REDUCE' && '🔴 REDUCE'}
                  </div>
                  {currentDebate.allocationPercent > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      Allocation: {currentDebate.allocationPercent}% of treasury
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Decisions */}
      <div className="bg-dark-200 rounded-xl p-4">
        <h3 className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-3">RECENT DECISIONS</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No debates yet
            </div>
          ) : (
            history.slice(0, 5).map((debate, idx) => (
              <div key={idx} className="p-2 bg-dark-300 rounded-lg text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-bull">{debate.asset}</span>
                  <span className={`font-bold ${
                    debate.decision === 'BUY' ? 'text-bull' : 
                    debate.decision === 'REDUCE' ? 'text-bear' : 'text-gray-400'
                  }`}>
                    {debate.decision}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>{new Date(debate.timestamp).toLocaleTimeString()}</span>
                  <span>{debate.votes?.BUY || 0}/{debate.votes?.HOLD || 0}/{debate.votes?.REDUCE || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TreasuryPanel;