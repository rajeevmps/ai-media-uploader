import { CheckCircle2, ExternalLink, Share2, Instagram, Youtube } from 'lucide-react';
import Button from '../ui/Button';
import CopyButton from '../ui/CopyButton';
import styles from './PostConfirmation.module.css';
import clsx from 'clsx';

/**
 * PostConfirmation - Success screen after posting to social media
 */
const PostConfirmation = ({
    postUrl,
    platform,
    caption,
    publishedAt,
    onPostAnother,
    onGoBack,
}) => {
    const platformConfig = {
        instagram: {
            name: 'Instagram',
            icon: Instagram,
            color: 'var(--color-instagram, 225, 48, 108)',
            gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
        },
        youtube: {
            name: 'YouTube',
            icon: Youtube,
            color: 'var(--color-youtube, 255, 0, 0)',
            gradient: 'linear-gradient(45deg, #FF0000, #cc0000)',
        },
        twitter: {
            name: 'Twitter/X',
            icon: Share2,
            color: '0, 0, 0',
            gradient: 'linear-gradient(45deg, #000, #333)',
        },
        facebook: {
            name: 'Facebook',
            icon: Share2,
            color: '24, 119, 242',
            gradient: 'linear-gradient(45deg, #1877f2, #166fe5)',
        },
    };

    const config = platformConfig[platform] || platformConfig.instagram;
    const PlatformIcon = config.icon;

    const formattedDate = publishedAt
        ? new Date(publishedAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : 'Just now';

    return (
        <div className={styles.container}>
            {/* Success Animation */}
            <div className={styles.successIcon}>
                <div className={styles.successCircle} style={{ background: config.gradient }}>
                    <CheckCircle2 size={48} color="white" />
                </div>
                <div className={styles.confetti} />
            </div>

            <h2 className={styles.title}>Posted Successfully!</h2>
            <p className={styles.subtitle}>
                Your content is now live on {config.name}
            </p>

            {/* Platform Card */}
            <div className={styles.platformCard}>
                <div className={styles.platformHeader}>
                    <div
                        className={styles.platformIcon}
                        style={{ background: config.gradient }}
                    >
                        <PlatformIcon size={20} color="white" />
                    </div>
                    <div className={styles.platformInfo}>
                        <span className={styles.platformName}>{config.name}</span>
                        <span className={styles.publishedAt}>{formattedDate}</span>
                    </div>
                </div>

                {caption && (
                    <div className={styles.captionPreview}>
                        <p className={styles.captionText}>
                            {caption.length > 150 ? `${caption.substring(0, 150)}...` : caption}
                        </p>
                    </div>
                )}

                {postUrl && (
                    <div className={styles.postLink}>
                        <span className={styles.linkLabel}>Post URL:</span>
                        <div className={styles.linkRow}>
                            <a
                                href={postUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.link}
                            >
                                {postUrl}
                                <ExternalLink size={14} />
                            </a>
                            <CopyButton text={postUrl} variant="icon" size="sm" />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                {postUrl && (
                    <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewPostButton}
                        style={{ background: config.gradient }}
                    >
                        <ExternalLink size={18} />
                        View Post
                    </a>
                )}
                <Button variant="secondary" onClick={onPostAnother}>
                    Post to Another Platform
                </Button>
                <Button variant="ghost" onClick={onGoBack}>
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default PostConfirmation;
