import React from 'react';
import { DeleteConfirmationProps } from '../types/components';

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 32,
        minWidth: 320,
        boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 20, marginBottom: 16 }}>
          {message || 'Ви впевнені, що хочете видалити цей запис?'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={onConfirm}
          >
            Видалити
          </button>
          <button
            style={{
              background: '#f7fdfe',
              color: '#222',
              border: '1px solid #ccc',
              borderRadius: 4,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
            onClick={onCancel}
          >
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
