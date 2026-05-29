import React from "react";
import './styles/comments.scss';
import { useTableStore } from "../store-zustand";
import { EditModalProps } from "../types/components";

function isHistoryComment(body: string): boolean {
  return /^\[\d{2}\.\d{2}\.\d{4}/.test(body) && body.includes('змінив відповідального');
}

const EditModal: React.FC<EditModalProps> = ({ journalId, onAddComment, onClose, isObserver, requireReason }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [reason, setReason] = React.useState('');
  const [reasonError, setReasonError] = React.useState('');
  const comments = useTableStore(state => state?.commentsById?.[journalId as number] || []);
  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <div className="edit-modal-header">
          <h3>
            <span role="img" aria-label="Коментарі" style={{ marginRight: 8 }}>💬</span>
            Коментарі
          </h3>
          <button
            type="button"
            className="edit-modal-close-btn"
            onClick={onClose}
            title="Закрити"
            aria-label="Закрити модальне вікно"
          >
            ✖️
          </button>
        </div>
        <div className="edit-comments-section">
          <div className="edit-comments-list">
            {comments && comments.length > 0 ? (
              <div>
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className={`edit-comment-item${isHistoryComment(comment.body) ? ' edit-comment-item--history' : ''}`}
                  >
                    <div className="edit-comment-author">
                      <span className="edit-comment-author-name">{comment.authorName}</span>
                      <span className="edit-comment-author-date">{new Date(comment.creationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="edit-comment-body">{comment.body}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="edit-no-comments">Коментарів немає</div>
            )}
          </div>
          {!isObserver && (
            <div className="edit-add-comment">
              {requireReason ? (
                <div className="edit-add-comment-required-panel">
                  <div className="edit-add-comment-required-panel__header">
                    <span role="img" aria-label="warning" style={{ marginRight: 6 }}>⚠️</span>
                    Для збереження необхідно вказати причину прийняття дефекту
                  </div>
                  <div className="edit-add-comment-required-panel__body">
                    <div className="edit-add-comment-field">
                      <label className="edit-add-comment-field__label">
                        Причина прийняття <span className="edit-add-comment-field__required">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Вкажіть причину прийняття дефекту..."
                        value={reason}
                        onChange={e => {
                          setReason(e.target.value);
                          if (e.target.value.trim()) setReasonError('');
                        }}
                        className="edit-comment-textarea"
                      />
                      {reasonError && <span className="edit-field-error">{reasonError}</span>}
                    </div>
                    <div className="edit-add-comment-field">
                      <label className="edit-add-comment-field__label">
                        Коментар <span className="edit-add-comment-field__required">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Введіть коментар..."
                        ref={textareaRef}
                        className="edit-comment-textarea"
                      />
                    </div>
                    <div className="edit-add-comment-required-panel__actions">
                      <button
                        type="button"
                        onClick={() => {
                          const value = textareaRef.current?.value.trim();
                          if (!reason.trim()) {
                            setReasonError('Вкажіть причину прийняття дефекту');
                            return;
                          }
                          if (value) {
                            onAddComment({ body: `Причина прийняття: ${reason.trim()}\n${value}`, authorId: 1, journalId: journalId as number });
                            if (textareaRef.current) textareaRef.current.value = '';
                            setReason('');
                          }
                        }}
                        className="edit-add-comment-btn"
                      >
                        Додати
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="edit-add-comment-actions">
                  <textarea
                    rows={1}
                    placeholder="Введіть новий коментар..."
                    ref={textareaRef}
                    className="edit-comment-textarea"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const value = textareaRef.current?.value.trim();
                      if (value) {
                        onAddComment({ body: value, authorId: 1, journalId: journalId as number });
                        if (textareaRef.current) textareaRef.current.value = '';
                      }
                    }}
                    className="edit-add-comment-btn"
                  >
                    Додати
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
