import React, { useEffect, useRef } from 'react';

const agentConfig = {
  ORACLE: { name: 'ORACLE · Quant', icon: '🔵', color: 'quant', bg: 'bg-quant/10', border: 'border-quant/30' },
  APOLLO: { name: 'APOLLO · Bull', icon: '🟢', color: 'bull', bg: 'bg-bull/10', border: 'border-bull/30' },
  CASSANDRA: { name: 'CASSANDRA · Bear', icon: '🔴', color: 'bear', bg: 'bg-bear/10', border: 'border-bear/30' },
  SENTINEL: { name: 'SENTINEL · Risk', icon: '🟡', color: 'risk', bg: 'bg-risk/10', border: 'border-risk/30' },
};

function DebateTranscript({ steps, isActive }) {
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [steps]);

  const formatContent = (content) => {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="bg-dark-300 rounded-xl glow-border overflow-hidden">
      <div className="bg-dark-200 px-4 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500"># DEBATE_HALL</span>
          {isActive && (
            <div className="flex items-center gap-1 ml-auto">
              <span className="w-2 h-2 bg-bull rounded-full animate-pulse"></span>
              <span className="text-xs text-bull">debating...</span>
            </div>
          )}
        </div>
      </div>
      
      <div
        ref={transcriptRef}
        className="h-[300px] lg:h-[350px] overflow-y-auto p-3 space-y-3 font-mono text-xs"
      >
        {steps.length === 0 && !isActive && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="text-xs">No active debate</p>
            <p className="text-[10px] mt-1">Click "Start Debate" to begin</p>
          </div>
        )}
        
        {steps.map((step, idx) => {
          const config = agentConfig[step.agent];
          return (
            <div
              key={idx}
              className={`flex gap-2 p-2 rounded-lg ${config.bg} border-l-4 ${config.border} animate-slide-in`}
            >
              <div className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center text-sm flex-shrink-0`}>
                {config.icon}
              </div>
              <div className="flex-1">
                <div className={`text-[10px] font-bold tracking-wider text-${config.color} mb-0.5`}>
                  {config.name}
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[11px]">
                  {formatContent(step.content)}
                </div>
                <div className="text-[9px] text-gray-600 mt-1 font-mono">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        
        {isActive && steps.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-bull/30 border-t-bull rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500 text-xs">Initializing debate...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DebateTranscript;