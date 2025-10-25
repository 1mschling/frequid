import { useEffect, useRef, useState } from 'react';
import { useActor } from './useActor';
import { recordActivityEntropy } from '../lib/encryption';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const WARNING_THRESHOLD = 4 * 60 * 1000; // Show warning at 4 minutes
const UPDATE_INTERVAL = 30 * 1000; // Update backend every 30 seconds

export function useUserLiveliness(onInactive?: () => void) {
  const { actor } = useActor();
  const [isActive, setIsActive] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilInactive, setTimeUntilInactive] = useState(INACTIVITY_TIMEOUT);
  
  const lastActivityRef = useRef<number>(Date.now());
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Record user activity
  const recordActivity = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    setIsActive(true);
    setShowWarning(false);
    setTimeUntilInactive(INACTIVITY_TIMEOUT);
    
    // Record activity timing for encryption entropy enhancement
    recordActivityEntropy(now);
  };

  useEffect(() => {
    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, recordActivity, { passive: true });
    });

    // Check inactivity status
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const inactiveTime = now - lastActivityRef.current;
      const remaining = INACTIVITY_TIMEOUT - inactiveTime;
      
      setTimeUntilInactive(Math.max(0, remaining));

      if (inactiveTime >= INACTIVITY_TIMEOUT) {
        setIsActive(false);
        setShowWarning(false);
        if (onInactive) {
          onInactive();
        }
      } else if (inactiveTime >= WARNING_THRESHOLD) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    // Update backend activity status periodically
    updateIntervalRef.current = setInterval(async () => {
      if (actor && isActive) {
        try {
          await actor.updateUserActivity();
        } catch (error) {
          console.error('Failed to update user activity:', error);
        }
      }
    }, UPDATE_INTERVAL);

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, recordActivity);
      });
      
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [actor, isActive, onInactive]);

  return {
    isActive,
    showWarning,
    timeUntilInactive,
    recordActivity,
  };
}

