import React from 'react';
import { Department, CommentRequest } from '../../types';
import { TABLE_COLUMNS } from '../../constants/tableColumns';
import CommentsModal from '../../components/CommentsModal';

interface MoveAndCommentsSectionProps {
    redirectRegionId: string;
    setRedirectRegionId: (value: string) => void;
    isCreateMode: boolean;
    isObserver: boolean;
    departments: Department[];
    showCommentsModal: boolean;
    setShowCommentsModal: (value: boolean) => void;
    onAddComment: (comment: CommentRequest) => void;
    requiresAcceptComment: boolean;
    journalId: number | null;
    existingComments?: string[];
}

const MoveAndCommentsSection: React.FC<MoveAndCommentsSectionProps> = ({
    redirectRegionId,
    setRedirectRegionId,
    isCreateMode,
    isObserver,
    departments,
    showCommentsModal,
    setShowCommentsModal,
    onAddComment,
    requiresAcceptComment,
    journalId,
    existingComments,
}) => {
    return (
        <>
            {existingComments && existingComments.length > 0 && (
                <div className="edit-row">
                    <label className="edit-label">{TABLE_COLUMNS.DEFECT_COMMENT}</label>
                    <div className="edit-comments-display">
                        {existingComments.map((comment, index) => (
                            <p key={index} className="edit-comments-display__item">{comment}</p>
                        ))}
                    </div>
                </div>
            )}
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.MOVE_TO}</label>
                <select
                    name="moveTo"
                    value={redirectRegionId}
                    disabled={isCreateMode || isObserver}
                    onChange={e => setRedirectRegionId(e.target.value)}
                    style={{ flex: 1 }}
                >
                    <option value="">Оберіть</option>
                    {departments.map(department => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                    ))}
                </select>
            </div>
            <div className="edit-row">
                <label className="edit-label">{TABLE_COLUMNS.COMMENTS}</label>
                <button type="button" onClick={() => setShowCommentsModal(true)} className="edit-comments-btn">
                    <span role="img" aria-label="comments">💬</span>
                    <span>Коментарі</span>
                </button>
            </div>
            {showCommentsModal && (
                <CommentsModal
                    journalId={journalId}
                    onAddComment={onAddComment}
                    onClose={() => setShowCommentsModal(false)}
                    isObserver={isObserver}
                    requireReason={requiresAcceptComment}
                />
            )}
        </>
    );
};

export default MoveAndCommentsSection;
