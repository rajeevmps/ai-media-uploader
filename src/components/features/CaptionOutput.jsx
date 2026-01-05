import { useState } from 'react';
import { Hash, Sparkles, RefreshCw, Bookmark } from 'lucide-react';
import CopyButton from '../ui/CopyButton';
import Button from '../ui/Button';
import { saveCaption } from '../../services/storage';
import { useToast } from '../ui/Toaster';
import styles from './CaptionOutput.module.css';
import clsx from 'clsx';

/**
 * CaptionOutput - Displays generated captions and hashtags with copy/save functionality
 */
const CaptionOutput = ({
    caption,
    hashtags = [],
    onRegenerate,
    isLoading = false,
    mediaName = '',
}) => {
    const [saved, setSaved] = useState(false);
    const { addToast } = useToast();

    const formattedHashtags = hashtags.map(tag =>
        tag.startsWith('#') ? tag : `#${tag}`
    ).join(' ');

    const fullText = `${caption}\n\n${formattedHashtags}`;

    const handleSave = () => {
        saveCaption({
            caption,
            hashtags,
            mediaName,
        });
        setSaved(true);
        addToast('Caption saved to library!', 'success');
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.loadingIcon}>
                        <Sparkles size={24} className={styles.sparkle} />
                    </div>
                    <p className={styles.loadingText}>Generating your caption...</p>
                    <div className={styles.loadingBar}>
                        <div className={styles.loadingProgress} />
                    </div>
                </div>
            </div>
        );
    }

    if (!caption) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Sparkles size={18} className={styles.headerIcon} />
                    <h3 className={styles.title}>Generated Caption</h3>
                </div>
                <div className={styles.headerActions}>
                    <CopyButton text={fullText} label="Copy All" size="sm" />
                </div>
            </div>

            {/* Caption Section */}
            <div className={styles.captionBox}>
                <div className={styles.captionHeader}>
                    <span className={styles.label}>Caption</span>
                    <CopyButton text={caption} variant="icon" size="sm" />
                </div>
                <p className={styles.captionText}>{caption}</p>
            </div>

            {/* Hashtags Section */}
            {hashtags.length > 0 && (
                <div className={styles.hashtagsBox}>
                    <div className={styles.hashtagsHeader}>
                        <div className={styles.hashtagLabel}>
                            <Hash size={14} />
                            <span>Hashtags ({hashtags.length})</span>
                        </div>
                        <CopyButton text={formattedHashtags} variant="icon" size="sm" />
                    </div>
                    <div className={styles.hashtagsGrid}>
                        {hashtags.map((tag, index) => (
                            <span key={index} className={styles.hashtag}>
                                #{tag.replace('#', '')}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={RefreshCw}
                    onClick={onRegenerate}
                    disabled={isLoading}
                >
                    Regenerate
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    icon={Bookmark}
                    onClick={handleSave}
                    disabled={saved}
                >
                    {saved ? 'Saved!' : 'Save to Library'}
                </Button>
            </div>
        </div>
    );
};

export default CaptionOutput;
