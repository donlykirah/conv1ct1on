import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DebateTranscript3D({ steps, isActive, currentSpeaker, onClose }) {
  const scrollRef = useRef(null);
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps]);
  
  const agentStyles = {
    ORACLE: { border: '#00ccff', bg: 'rgba(0,204,255,0.05)', icon: '🔵', name: 'ORACLE · THE QUANT', color: '#00ccff' },
    APOLLO: { border: '#00ff88', bg: 'rgba(0,255,136,0.05)', icon: '🟢', name: 'APOLLO · THE BULL', color: '#00ff88' },
    CASSANDRA: { border: '#ff3366', bg: 'rgba(255,51,102,0.05)', icon: '🔴', name: 'CASSANDRA · THE BEAR', color: '#ff3366' },
    SENTINEL: { border: '#ffaa00', bg: 'rgba(255,170,0,0.05)', icon: '🟡', name: 'SENTINEL · THE RISK', color: '#ffaa00' },
  };
  
  return (
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255,193,7,0.3)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fbbf24',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
      >
        ✕
      </button>
      
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,193,7,0.15)',
        paddingRight: '56px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fbbf24', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fbbf24', letterSpacing: '1px', textTransform: 'uppercase' }}>
            SENATE TRANSCRIPT
          </span>
          {isActive && currentSpeaker && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00ff88', animation: 'pulse 1s infinite' }} />
              <span style={{ fontSize: '10px', color: '#00ff88', textTransform: 'uppercase' }}>
                {currentSpeaker} speaking...
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div 
        ref={scrollRef}
        className="debate-scroll"
        style={{
          height: '380px',
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <AnimatePresence>
          {steps.map((step, idx) => {
            const style = agentStyles[step.agent];
            return (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: style.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {style.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontSize: '11px', 
                      fontWeight: 'bold', 
                      letterSpacing: '0.5px', 
                      color: style.color,
                      marginBottom: '8px'
                    }}>
                      {style.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'monospace'
                    }}>
                      {step.content}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.25)',
                      marginTop: '12px',
                      fontFamily: 'monospace'
                    }}>
                      {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default DebateTranscript3D;