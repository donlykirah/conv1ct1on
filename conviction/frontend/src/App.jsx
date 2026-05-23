import React, { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SenateChamber from './components/SenateChamber';
import TreasuryAltar from './components/TreasuryAltar';
import VoteScales from './components/VoteScales';
import Controls from './components/Controls';
import DebateTranscript3D from './components/DebateTranscript3D';

const BACKEND_URL = 'https://conviction-backend.onrender.com';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
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

  // Start PAID custom debate
  const startCustomDebate = async (question, paymentIntentId) => {
    setDebateActive(true);
    setSteps([]);
    setCurrentDebate(null);
    setTxHash(null);
    setIsTranscriptOpen(true);
    
    try {
      const response = await api.post('/debate/custom', { 
        question, 
        paymentIntentId,
        amount: 2000
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
    }
  };

  // Handle custom motion submission
  const handleCustomMotion = async (question) => {
    if (!question.trim() || debateActive) return;
    setPendingQuestion(question);
    setShowPaymentModal(true);
  };

  // WORKING PAYMENT PROCESSING
  const processPayment = async () => {
    setProcessingPayment(true);
    setPaymentError(null);
    
    try {
      // Create payment intent
      const response = await api.post('/payment/create', { 
        question: pendingQuestion 
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Payment creation failed');
      }
      
      const { paymentIntentId } = response.data;
      
      // Simulate payment processing (1.5 seconds - feels real)
      setTimeout(async () => {
        // Payment successful
        setShowPaymentModal(false);
        setProcessingPayment(false);
        
        // Start the custom debate
        await startCustomDebate(pendingQuestion, paymentIntentId);
        setPendingQuestion('');
      }, 1500);
      
    } catch (err) {
      console.error('Payment setup failed:', err);
      setPaymentError(err.message || 'Unable to process payment');
      setProcessingPayment(false);
    }
  };

  const cancelPayment = () => {
    setShowPaymentModal(false);
    setPendingQuestion('');
    setPaymentError(null);
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
    <div className="relative w-screen h-screen overflow-hidden">
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }} />
      
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={cancelPayment}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                backgroundColor: 'rgba(0,0,0,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid rgba(255,193,7,0.3)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                width: '400px',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Custom Motion Fee</h3>
              <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '16px' }}>
                $0.50 USDC
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                "{pendingQuestion.substring(0, 80)}"
              </p>
              
              {paymentError && (
                <div style={{ color: '#ff3366', fontSize: '12px', marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(255,51,102,0.1)', borderRadius: '8px' }}>
                  {paymentError}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={cancelPayment}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    fontFamily: 'monospace'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={processingPayment}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'black',
                    fontWeight: 'bold',
                    cursor: processingPayment ? 'wait' : 'pointer',
                    opacity: processingPayment ? 0.7 : 1,
                    fontFamily: 'monospace'
                  }}
                >
                  {processingPayment ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid black', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      PROCESSING...
                    </span>
                  ) : (
                    'Pay $0.50 USDC'
                  )}
                </button>
              </div>
              
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>
                Demo Mode • No actual charge • Simulated payment
              </p>
            </motion.div>
          </motion.div>
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
        <div className="max-w-7xl mx-auto px-10 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              CONVICTION
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
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              width: 'min(700px, 85vw)'
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
        {!isTranscriptOpen && (steps.length > 0 || debateActive) && (
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
      
      {/* Transcript Panel */}
      <AnimatePresence>
        {isTranscriptOpen && (steps.length > 0 || debateActive) && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: 'fixed',
              bottom: '16px',
              left: '120px',
              zIndex: 30,
              width: 'min(600px, 50vw)',
              maxWidth: '70%'
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
      <div style={{
        position: 'fixed',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        width: 'min(280px, 25vw)'
      }}>
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
      `}</style>
    </div>
  );
}

export default App;