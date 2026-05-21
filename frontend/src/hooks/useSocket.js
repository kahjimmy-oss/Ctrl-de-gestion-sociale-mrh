import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socketInstance = null;

export function useSocket(user) {
  const handlersRef = useRef({});

  useEffect(() => {
    if (!user) return;

    if (!socketInstance) {
      socketInstance = io('/', { withCredentials: true });
    }

    socketInstance.emit('authenticate', user._id);

    const handlers = {
      'mission:unlocked': (data) => {
        toast.success(data.message || 'Nouvelle mission débloquée !', { duration: 5000, icon: '🎯' });
      },
      'submission:validated': (data) => {
        if (data.status === 'approuvee') {
          toast.success(data.message, { duration: 6000, icon: '✅' });
        } else if (data.status === 'a_retravailler') {
          toast(data.message, { duration: 6000, icon: '⚠️' });
        }
        window.dispatchEvent(new CustomEvent('submission:update', { detail: data }));
      },
      'evaluation:unlocked': (data) => {
        toast.success(data.message, { duration: 5000, icon: '📝' });
        window.dispatchEvent(new CustomEvent('evaluation:unlocked', { detail: data }));
      },
      'evaluation:graded': (data) => {
        toast.success(data.message, { duration: 7000, icon: '📊' });
        window.dispatchEvent(new CustomEvent('evaluation:graded', { detail: data }));
      },
      'badge:earned': (data) => {
        toast.success(data.message, { duration: 8000, icon: '🏅', style: { background: '#fef3c7', color: '#92400e' } });
      },
      'seance:unlocked': (data) => {
        toast.success(data.message, { duration: 6000, icon: '🔓' });
        window.dispatchEvent(new CustomEvent('seance:unlocked', { detail: data }));
      },
      'submission:received': (data) => {
        if (user.role === 'instructor') {
          toast(
            `📥 Livrable reçu : ${data.studentName}\n${data.missionTitle}`,
            { duration: 8000, icon: '📋', style: { background: '#eff6ff', color: '#1e40af' } }
          );
          window.dispatchEvent(new CustomEvent('submission:received', { detail: data }));
        }
      }
    };

    handlersRef.current = handlers;
    Object.entries(handlers).forEach(([event, handler]) => {
      socketInstance.on(event, handler);
    });

    return () => {
      Object.entries(handlersRef.current).forEach(([event, handler]) => {
        socketInstance?.off(event, handler);
      });
    };
  }, [user]);

  return socketInstance;
}
