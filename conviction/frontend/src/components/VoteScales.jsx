import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function VoteScales({ votes }) {
  const [animatedVotes, setAnimatedVotes] = useState({ BUY: 0, HOLD: 0, REDUCE: 0 });
  const total = votes.BUY + votes.HOLD + votes.REDUCE;
  
  useEffect(() => {
    const duration = 500;
    const startTime = performance.now();
    const startVotes = animatedVotes;
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      setAnimatedVotes({
        BUY: Math.floor(startVotes.BUY + (votes.BUY - startVotes.BUY) * progress),
        HOLD: Math.floor(startVotes.HOLD + (votes.HOLD - startVotes.HOLD) * progress),
        REDUCE: Math.floor(startVotes.REDUCE + (votes.REDUCE - startVotes.REDUCE) * progress),
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [votes]);
  
  const getAngle = (count) => {
    if (total === 0) return 0;
    return (count / total) * 180 - 90;
  };
  
  return (
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      padding: '16px',
      border: '1px solid rgba(255,193,7,0.3)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      width: '320px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          THE SCALES OF JUSTICE
        </div>
        <div style={{ fontSize: '2.5rem' }}>⚖️</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* BUY */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#00ff88', fontWeight: 'bold' }}>🟢 BUY</span>
            <span style={{ fontFamily: 'monospace', color: 'white' }}>{animatedVotes.BUY}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', backgroundColor: '#00ff88', borderRadius: '999px' }}
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(votes.BUY / total) * 100}%` : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* HOLD */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#9ca3af', fontWeight: 'bold' }}>⏸ HOLD</span>
            <span style={{ fontFamily: 'monospace', color: 'white' }}>{animatedVotes.HOLD}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', backgroundColor: '#6b7280', borderRadius: '999px' }}
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(votes.HOLD / total) * 100}%` : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        {/* REDUCE */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#ff3366', fontWeight: 'bold' }}>🔴 REDUCE</span>
            <span style={{ fontFamily: 'monospace', color: 'white' }}>{animatedVotes.REDUCE}</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', backgroundColor: '#ff3366', borderRadius: '999px' }}
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(votes.REDUCE / total) * 100}%` : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Scale animation */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: getAngle(animatedVotes.BUY) - getAngle(animatedVotes.REDUCE) }}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-block' }}
        >
          <div style={{ fontSize: '2rem' }}>⚖️</div>
        </motion.div>
      </div>
    </div>
  );
}

export default VoteScales;