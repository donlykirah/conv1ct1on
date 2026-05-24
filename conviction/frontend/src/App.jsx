import React, { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SenateChamber from './components/SenateChamber';
import TreasuryAltar from './components/TreasuryAltar';
import VoteScales from './components/VoteScales';
import Controls from './components/Controls';
import DebateTranscript3D from './components/DebateTranscript3D';

const BACKEND_URL = 'http://localhost:3001';
const api = axios.create({ baseURL: `${BACKEND_URL}/api` });

function App() {
  const [debateActive, setDebateActive] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentDebate, setCurrentDebate] = useState(null);
  const [treasuryBalance, setTreasuryBalance] = useState(10000);
  const [activeLight, setActiveLight] = useState(null);
  const [viewerCount, setViewerCount] = useState(47);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rollingBalance, setRollingBalance] = useState(10000);
  const [txHash, setTxHash] = useState(null);
  
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  
  // Payment simulation state - ONLY ONE DECLARATION EACH
  const [showPaymentSimulation, setShowPaymentSimulation] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const audioRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Working sound
  const playGavel = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const shareOnX = () => {
    if (!currentDebate) return;
    const text = `🏛️ CONVICTION: AI agents just decided to ${currentDebate.decision} ${currentDebate.asset}!\n\nWatch: ${window.location.href}\n\n#Conviction #AIAgents #DeFi`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  // Start FREE debate
  const startDebate = async (asset = 'BTC', amount = 2000) => {
    if (debateActive) return;
    
    setDebateActive(true);
    setSteps([]);
    setCurrentDebate(null);
    setTxHash(null);
    setViewerCount(prev => prev + Math.floor(Math.random() * 20));
    setIsTranscriptOpen(true);
    
    try {
      const response = await api.post('/debate/start', { asset, amount });
      const { debateId } = response.data;
      
      if (eventSourceRef.current) eventSourceRef.current.close();
      
      const eventSource = new EventSource(`${BACKEND_URL}/api/debate/stream/${debateId}`);
      eventSourceRef.current = eventSource;
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'step') {
          setSteps(prev => [...prev, data.step]);
          setCurrentSpeaker(data.step.agent);
          setActiveLight(data.step.agent);
          setTimeout(() => setActiveLight(null), 3000);
        } else if (data.type === 'complete') {
          setCurrentDebate(data.debate);
          setTxHash(data.debate.txHash);
          setDebateActive(false);
          setCurrentSpeaker(null);
          
          if (data.debate.decision === 'BUY') {
            setShowConfetti(true);
            playGavel();
            setTimeout(() => setShowConfetti(false), 3000);
          } else {
            playGavel();
          }
          
          eventSource.close();
        }
      };
      
      eventSource.onerror = () => {
        setDebateActive(false);
        eventSource.close();
      };
      
    } catch (error) {
      console.error('Failed to start debate:', error);
      setDebateActive(false);
    }
  };

  // Handle custom motion submission - shows payment modal
  const handleCustomMotion = (question) => {
    if (!question.trim() || debateActive) return;
    setPendingQuestion(question);
    setShowPaymentSimulation(true);
  };

  // Process simulated payment and start custom debate
  const processSimulatedPayment = () => {
    setProcessingPayment(true);
    
    setTimeout(async () => {
      setShowPaymentSimulation(false);
      setProcessingPayment(false);
      
      const assetMatch = pendingQuestion.match(/BTC|ETH|SOL/i);
      const asset = assetMatch ? assetMatch[0] : 'BTC';
      
      setDebateActive(true);
      setSteps([]);
      setCurrentDebate(null);
      setTxHash(null);
      setIsTranscriptOpen(true);
      
      try {
        const response = await api.post('/debate/start', { 
          asset, 
          amount: 2000,
          customQuestion: pendingQuestion 
        });
        
        const { debateId } = response.data;
        
        if (eventSourceRef.current) eventSourceRef.current.close();
        
        const eventSource = new EventSource(`${BACKEND_URL}/api/debate/stream/${debateId}`);
        eventSourceRef.current = eventSource;
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'step') {
            setSteps(prev => [...prev, data.step]);
            setCurrentSpeaker(data.step.agent);
            setActiveLight(data.step.agent);
            setTimeout(() => setActiveLight(null), 3000);
          } else if (data.type === 'complete') {
            setCurrentDebate(data.debate);
            setTxHash(data.debate.txHash);
            setDebateActive(false);
            setCurrentSpeaker(null);
            
            if (data.debate.decision === 'BUY') {
              setShowConfetti(true);
              playGavel();
              setTimeout(() => setShowConfetti(false), 3000);
            } else {
              playGavel();
            }
            
            eventSource.close();
          }
        };
        
        eventSource.onerror = () => {
          setDebateActive(false);
          eventSource.close();
        };
        
      } catch (error) {
        console.error('Custom debate failed:', error);
        setDebateActive(false);
        alert('Failed to start debate. Please try again.');
      }
      
      setPendingQuestion('');
    }, 1500);
  };

  // Cancel payment simulation
  const cancelPaymentSimulation = () => {
    setShowPaymentSimulation(false);
    setPendingQuestion('');
    setProcessingPayment(false);
  };

  // Treasury roll animation
  useEffect(() => {
    if (treasuryBalance !== rollingBalance) {
      let start = rollingBalance;
      let end = treasuryBalance;
      let duration = 500;
      let startTime = performance.now();
      
      const animate = (now) => {
        let elapsed = now - startTime;
        let progress = Math.min(1, elapsed / duration);
        let current = start + (end - start) * progress;
        setRollingBalance(current);
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [treasuryBalance, rollingBalance]);

  // Live spectator counter
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(12, prev + (Math.random() > 0.7 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  // Initialize audio
  useEffect(() => {
    try {
      audioRef.current = new Audio('https://www.orangefreesounds.com/wp-content/uploads/2021/04/Gavel-sound-effect.mp3');
      audioRef.current.volume = 0.25;
    } catch (e) {
      audioRef.current = null;
    }
    
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, []);

  return (
    <div
  className="relative w-screen h-screen overflow-hidden"
  style={{
    zoom: window.innerWidth < 1600 ? 0.82 : 1
  }}
>
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }} />
     
 {/* Payment Simulation Modal - FIXED with actual padding */}
<AnimatePresence>
  {showPaymentSimulation && (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={cancelPaymentSimulation}
    >
      <div 
        className="bg-black/95 rounded-2xl border border-amber-500/30 w-[380px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {!processingPayment ? (
          <div className="p-8">
            {/* Header */}
            <div className="text-center">
              <div className="text-6xl mb-5">💰</div>
              <h3 className="text-2xl font-bold text-white mb-2">Custom Motion</h3>
              <p className="text-sm text-white/50">Have our AI agents debate your question</p>
            </div>
            
            {/* Price */}
            <div className="text-center my-8 py-4 border-y border-white/10 bg-white/5 -mx-8 px-8">
              <div className="text-2xl font-bold text-amber-400">$0.50 USD</div>
              <p className="text-xs text-white/40 mt-2">One-time payment • No subscription</p>
            </div>
            
            {/* Question Preview */}
            <div className="mb-8">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Your Question</p>
                <p className="text-base text-white/90 leading-relaxed break-words">
                  "{pendingQuestion.substring(0, 80)}"
                  {pendingQuestion.length > 80 && "..."}
                </p>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <button 
                onClick={cancelPaymentSimulation}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={processSimulatedPayment}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl text-black font-bold transition-all shadow-lg"
              >
                Pay $0.50
              </button>
            </div>
            
            {/* Footer */}
            <div className="text-center">
              <p className="text-[11px] text-white/30">Demo Mode • Simulated payment • No actual charge</p>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Processing Payment</h3>
            <p className="text-sm text-white/50">Please wait while we confirm your transaction...</p>
            <p className="text-xs text-white/30 mt-6">This is a simulated payment for demo purposes</p>
          </div>
        )}
      </div>
    </div>
  )}
</AnimatePresence>
      
      <Suspense fallback={<div className="fixed inset-0 bg-black flex items-center justify-center text-white/50">Loading 3D Chamber...</div>}>
        <SenateChamber activeLight={activeLight} currentSpeaker={currentSpeaker} />
      </Suspense>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-t from-bull/20 to-transparent" />
        </div>
      )}
      
      {/* Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              BEMA
            </h1>
            <p className="text-xs text-amber-400/60 mt-1">SENATE CHAMBER · ARC L1</p>
          </div>
          
          <div className="flex gap-12">
            <div className="text-right">
              <div className="text-xs text-white/40 mb-1">TREASURY</div>
              <TreasuryAltar balance={rollingBalance} />
            </div>
            <div className="text-right">
              <div className="text-xs text-white/40 mb-1">SPECTATORS</div>
              <div className="text-2xl font-mono text-amber-400">{viewerCount}</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Controls Button */}
      <AnimatePresence>
        {!isControlsOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsControlsOpen(true)}
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '60px',
              fontFamily: 'monospace',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'black',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            <span style={{ fontSize: '24px' }}>🎭</span> 
            OPEN CONTROLS
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Controls Panel */}
      <AnimatePresence>
        {isControlsOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
            width: 'min(540px, calc(100vw - 24px))',
maxWidth: '540px'
            }}
          >
            <Controls 
              onStartDebate={startDebate} 
              isDebating={debateActive}
              onClose={() => setIsControlsOpen(false)}
              onSubmitCustom={handleCustomMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Transcript Bubble */}
      <AnimatePresence>
        {/* Transcript Bubble - Shows ONLY when transcript is closed but has content */}
{!isTranscriptOpen && (steps.length > 0) && (
  <motion.button
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setIsTranscriptOpen(true)}
    style={{
      position: 'fixed',
      bottom: '32px',
      left: '32px',
      zIndex: 30,
      width: '64px',
      height: '64px',
      backgroundColor: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '50%',
      border: '2px solid rgba(255,193,7,0.5)',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      cursor: 'pointer'
    }}
  >
    💬
    {steps.length > 0 && (
      <span style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '24px',
        height: '24px',
        backgroundColor: '#f59e0b',
        borderRadius: '50%',
        color: 'black',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {steps.length}
      </span>
    )}
  </motion.button>
)}
      </AnimatePresence>
      
     
      {/* Transcript Panel - Shows when open AND has content */}
      <AnimatePresence>
{isTranscriptOpen && steps.length > 0 && (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -50, opacity: 0 }}
    transition={{ type: "spring", damping: 25 }}
    style={{
      position: 'fixed',
      bottom: '32px',
      left: '120px',
      zIndex: 30,
      width: 'min(520px, calc(100vw - 180px))',
      maxWidth: '520px'
    }}
  >
    <DebateTranscript3D 
      steps={steps} 
      isActive={debateActive} 
      currentSpeaker={currentSpeaker}
      onClose={() => setIsTranscriptOpen(false)}
    />
  </motion.div>
)}
</AnimatePresence>
      
      {/* Vote Scales */}
   <div className="fixed right-4 top-[28%] z-20 w-[300px] max-w-[24vw] xl:w-[320px] xl:max-w-[320px] lg:block hidden">
  <VoteScales votes={currentDebate?.votes || { BUY: 0, HOLD: 0, REDUCE: 0 }} txHash={txHash} />
</div>
      
      {/* Share Button */}
      {currentDebate && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnX}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 20,
            padding: '12px 24px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '40px',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fbbf24',
            fontSize: '13px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          🐦 SHARE DEBATE
        </motion.button>
      )}
      
      {/* Loading */}
      {debateActive && !steps.length && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-amber-400">SUMMONING THE SENATE...</p>
          </div>
        </div>
      )}
      
    <style>{`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* Mobile responsive fixes */
  @media (max-width: 768px) {
    /* Hide vote scales on mobile */
    .fixed.right-4 {
      display: none;
    }
    
    /* Adjust transcript position for mobile */
    div[style*="position: fixed"][style*="bottom: 32px"][style*="left: 120px"] {
      left: 16px !important;
      width: calc(100vw - 32px) !important;
      bottom: 80px !important;
    }
    
    /* Adjust controls panel width for mobile */
    div[style*="position: fixed"][style*="bottom: 32px"][style*="left: 50%"] {
      width: calc(100vw - 32px) !important;
      left: 16px !important;
      transform: translateX(0) !important;
    }
  }
`}</style>
    </div>
  );
}

export default App;