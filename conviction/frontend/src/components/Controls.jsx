import React, { useState } from 'react';
import { motion } from 'framer-motion';

function Controls({ onStartDebate, isDebating, onClose,  onSubmitCustom }) {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [customQuestion, setCustomQuestion] = useState('');
  
  const assets = [
    { symbol: 'BTC', icon: '₿', gradient: 'linear-gradient(135deg, #f97316, #f59e0b)' },
    { symbol: 'ETH', icon: '⟠', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
    { symbol: 'SOL', icon: '◎', gradient: 'linear-gradient(135deg, #a855f7, #ec4899)' },
  ];
  
  const handleStart = () => {
    onStartDebate(selectedAsset, 2000);
  };
  
  const handleCustomSubmit = () => {
    if (customQuestion.trim() && onSubmitCustom) {
      onSubmitCustom(customQuestion);
      setCustomQuestion('');
    }
  };
  
  return (
    <div style={{
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255,193,7,0.3)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
      position: 'relative'
    }}>
      {/* Close Button - Top Right Corner, far from content */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '-12px',
          right: '-12px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#1a1a1a',
          border: '2px solid rgba(255,193,7,0.5)',
          color: '#fbbf24',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#333';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#1a1a1a';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ✕
      </button>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Asset Selectors */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {assets.map(asset => (
            <motion.button
              key={asset.symbol}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAsset(asset.symbol)}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: '12px',
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                ...(selectedAsset === asset.symbol
                  ? {
                      background: asset.gradient,
                      color: 'black',
                      boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)'
                    }
                  : {
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    })
              }}
            >
              {asset.icon} {asset.symbol}
            </motion.button>
          ))}
        </div>
        
        {/* Start Debate Button */}
        <motion.button
          whileHover={{ scale: isDebating ? 1 : 1.01 }}
          whileTap={{ scale: isDebating ? 1 : 0.99 }}
          onClick={handleStart}
          disabled={isDebating}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            fontSize: '18px',
            transition: 'all 0.2s',
            ...(isDebating
              ? {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'not-allowed'
                }
              : {
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'black',
                  boxShadow: '0 10px 20px -5px rgba(245,158,11,0.3)'
                })
          }}
        >
          {isDebating ? '⚡ DEBATING...' : '🎭 START DEBATE'}
        </motion.button>
      
        {/* Custom Question */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="Custom motion (0.50 USDC)..."
            disabled={isDebating}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'white',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCustomSubmit}
            disabled={isDebating || !customQuestion.trim()}
            style={{
              padding: '12px 20px',
              backgroundColor: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: '12px',
              color: '#fbbf24',
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              opacity: (isDebating || !customQuestion.trim()) ? 0.5 : 1,
              cursor: (isDebating || !customQuestion.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            💰 SUBMIT
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default Controls;