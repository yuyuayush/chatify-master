import React, { useEffect, useState, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const NumberSelection = () => {
  const { socket } = useAuthStore();
  const [numbers, setNumbers] = useState(
    Array.from({ length: 50 }, (_, i) => ({ number: i + 1, selectedBy: null }))
  );

  const userId = useMemo(() => Math.random().toString(36).substr(2, 5), []);

  useEffect(() => {
    if (!socket) return;

    socket.on('numbersUpdate', (data) => {
      // data should be { number, userId }
      setNumbers((prev) =>
        prev.map((n) =>
          n.number === data.number ? { ...n, selectedBy: data.userId } : n
        )
      );
    });

    return () => socket.off('numbersUpdate');
  }, [socket]);

  const handleSelect = (number) => {
    // Update locally
    setNumbers((prev) =>
      prev.map((n) =>
        n.number === number ? { ...n, selectedBy: userId } : n
      )
    );

    // Emit to server
    socket.emit('selectNumber', { number, userId });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Number Selection (1-50)</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '400px' }}>
        {numbers.map((n) => (
          <button
            key={n.number}
            onClick={() => handleSelect(n.number)}
            style={{
              width: '50px',
              height: '50px',
              margin: '5px',
              backgroundColor: n.selectedBy ? '#f00' : '#0f0',
              color: '#fff',
              fontWeight: 'bold',
              cursor: n.selectedBy ? 'not-allowed' : 'pointer',
              borderRadius: '5px',
              border: 'none',
            }}
          >
            {n.number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberSelection;
