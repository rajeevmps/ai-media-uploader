import { useState } from 'react';
import ActionGrid from '../features/ActionGrid';
import CaptionGenerator from '../features/CaptionGenerator';
import { ImageEditor, MediaEnhancer, SocialPoster } from '../features/OtherFeatures';
import Button from '../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { UploadZone } from '../features/UploadZone'; // Import local (composed) UploadZone
import { useToast } from '../ui/Toaster';
import { useAuth } from '../../context/AuthContext';
import { FEATURES } from '../../config/features';
import { WORKFLOW_STATUS } from '../../hooks/useWorkflowState';
import styles from './FlowController.module.css';

/* 
  FlowController Responsibility:
  1. Manages permission checks before rendering active tools.
  2. Routes API calls (mock).
  3. Manages global workflow state (Processing -> Completed).
  4. Handles error boundaries for features.
*/

const API_ENDPOINTS = {
    [FEATURES.CAPTION]: "/api/generate-caption",
    [FEATURES.EDIT]: "/api/edit-image",
    [FEATURES.ENHANCE]: "/api/enhance-media",
    [FEATURES.POST]: "/api/post-social",
};

const FlowController = ({ media, setRightPanelContent, workflow, setMedia }) => {
    const [activeAction, setActiveAction] = useState(null);
    const { hasFeature } = useAuth();
    const { addToast } = useToast();

    // Data Sharing
    const [generatedCaption, setGeneratedCaption] = useState("");

    const handleSelect = (actionId) => {
        // 1. Permission Check (Defensive)
        if (!hasFeature(actionId)) {
            addToast("Your current plan does not support this action.", "error");
            return;
        }

        // 2. Type Check
        if (actionId === FEATURES.EDIT && media.type !== 'image') {
            addToast("Image editing is not supported for videos.", "error");
            return;
        }

        setActiveAction(actionId);
        setRightPanelContent?.(renderContextPanel(actionId));
    };

    const handleBack = () => {
        setActiveAction(null);
        setRightPanelContent?.(null);
        workflow.setUploaded(); // Reset to Uploaded state
    };

    const handleActionComplete = (result, type) => {
        workflow.setCompleted();
        addToast("Action completed successfully!", "success");

        if (type === 'caption') {
            setGeneratedCaption(result);
        }
    }

    const handleActionStart = (actionId) => {
        workflow.setProcessing();
        console.log(`[FlowController] Calling API: ${API_ENDPOINTS[actionId]}`);
    }

    const renderContextPanel = (id) => {
        switch (id) {
            case FEATURES.CAPTION: return <div><h4>Caption Settings</h4><p className="text-muted text-sm mt-2">Tone: Professional</p></div>;
            case FEATURES.EDIT: return <div><h4>Editing History</h4><p className="text-muted text-sm mt-2">No edits applied yet.</p></div>;
            default: return null;
        }
    };

    // Replace Logic
    const handleReplace = (newMedia) => {
        setMedia(newMedia);
        handleBack(); // Reset flow
        addToast("Media replaced. Workflow reset.", "info");
    };

    return (
        <div className={styles.flowContainer}>
            <div className={styles.layoutSplit}>
                {/* LEFT / CENTER STAGE */}
                <div className={styles.stage}>
                    {/* Media Preview (Always Visible in Flow) */}
                    <div className={styles.mediaArea}>
                        <UploadZone onUpload={handleReplace} currentMedia={media} />
                    </div>

                    {/* Action Area */}
                    <div className={styles.actionArea}>
                        {!activeAction ? (
                            <div className="animate-in fade-in">
                                <h2 className="text-xl font-bold mb-4">Select Action</h2>
                                <ActionGrid mediaType={media.type} onSelect={handleSelect} />
                            </div>
                        ) : (
                            <div className="animate-in fade-in h-full flex flex-col">
                                <div className="mb-4">
                                    <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={handleBack}>
                                        Back to Actions
                                    </Button>
                                </div>
                                <div className={styles.toolContainer}>
                                    {activeAction === FEATURES.CAPTION && (
                                        <CaptionGenerator
                                            media={media}
                                            onStart={() => handleActionStart(FEATURES.CAPTION)}
                                            onResult={(res) => handleActionComplete(res, 'caption')}
                                        />
                                    )}
                                    {activeAction === FEATURES.EDIT && (
                                        <ImageEditor
                                            media={media}
                                            onStart={() => handleActionStart(FEATURES.EDIT)}
                                            onResult={() => handleActionComplete(null, 'edit')}
                                        />
                                    )}
                                    {activeAction === FEATURES.ENHANCE && (
                                        <MediaEnhancer
                                            media={media}
                                            onStart={() => handleActionStart(FEATURES.ENHANCE)}
                                            onResult={() => handleActionComplete(null, 'enhance')}
                                        />
                                    )}
                                    {activeAction === FEATURES.POST && (
                                        <SocialPoster
                                            media={media}
                                            initialCaption={generatedCaption}
                                            onStart={() => handleActionStart(FEATURES.POST)}
                                            onResult={() => handleActionComplete(null, 'post')}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowController;
