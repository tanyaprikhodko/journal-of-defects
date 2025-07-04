import React from "react";
import './styles/comments.scss';
import { useTableStore } from "../store-zustand";

interface EditModalProps {
  journalId: number;
  onAddComment: (comment: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ journalId, onAddComment, onClose }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const comments = useTableStore(state => state?.commentsById?.[journalId] || []);
console.log('Comments for journalId', journalId, comments);
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
                  <div key={comment.id} className="edit-comment-item">
                    <div className="edit-comment-author">
                      <span className="edit-comment-author-name">{comment.authorName}</span>
                      <span className="edit-comment-author-date">{new Date(comment.creationDate).toLocaleDateString()}</span>
                    </div>
                  <div>{comment.body}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="edit-no-comments">Коментарів немає</div>
            )}
          </div>
          <div className="edit-add-comment">
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
                  onAddComment(value);
                  if (textareaRef.current) textareaRef.current.value = "";
                }
              }}
              className="edit-add-comment-btn"
            >
              Додати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
