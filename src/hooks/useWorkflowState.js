import { useState } from 'react';

export const WORKFLOW_STATUS = {
    IDLE: 'idle',
    UPLOADED: 'uploaded',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    ERROR: 'error'
};

export const useWorkflowState = () => {
    const [status, setStatus] = useState(WORKFLOW_STATUS.IDLE);
    const [error, setError] = useState(null);

    const resetWorkflow = () => {
        setStatus(WORKFLOW_STATUS.IDLE);
        setError(null);
    };

    const setProcessing = () => setStatus(WORKFLOW_STATUS.PROCESSING);
    const setCompleted = () => setStatus(WORKFLOW_STATUS.COMPLETED);
    const setUploaded = () => setStatus(WORKFLOW_STATUS.UPLOADED);
    const setWorkflowError = (msg) => {
        setStatus(WORKFLOW_STATUS.ERROR);
        setError(msg);
    };

    return {
        status,
        error,
        resetWorkflow,
        setProcessing,
        setCompleted,
        setUploaded,
        setWorkflowError
    };
};
