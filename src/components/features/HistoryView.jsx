import { useState, useEffect } from 'react';
import styles from './HistoryView.module.css';
import { Clock, FileText, Image as ImageIcon, Video, Trash2, Type, Sparkles, Share2, Wand2 } from 'lucide-react';
import { getHistory, clearHistory, deleteHistoryItem } from '../../services/storage';
import Button from '../ui/Button';
import CopyButton from '../ui/CopyButton';
import { useToast } from '../ui/Toaster';

const getActionIcon = (type) => {
    switch (type) {
        case 'caption': return Type;
        case 'edit': return Wand2;
        case 'enhance': return Sparkles;
        case 'post': return Share2;
        default: return FileText;
    }
};

const getActionLabel = (type) => {
    switch (type) {
        case 'caption': return 'Caption Generated';
        case 'edit': return 'Image Edited';
        case 'enhance': return 'Media Enhanced';
        case 'post': return 'Posted to Social';
        default: return 'Action Completed';
    }
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

export const HistoryView = () => {
    const [historyItems, setHistoryItems] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const { addToast } = useToast();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const history = getHistory();
        setHistoryItems(history);
    };

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all history?')) {
            clearHistory();
            setHistoryItems([]);
            addToast('History cleared', 'success');
        }
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        deleteHistoryItem(id);
        loadHistory();
        addToast('Item removed', 'success');
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (historyItems.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Activity History</h2>
                    <p>Your recent generations and actions will appear here.</p>
                </div>
                <div className={styles.emptyState}>
                    <Clock size={48} className={styles.emptyIcon} />
                    <h3>No history yet</h3>
                    <p>Start by uploading media and generating content!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2>Activity History</h2>
                    <p>View your recent generations and actions.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                    <Trash2 size={16} />
                    Clear All
                </Button>
            </div>

            <div className={styles.list}>
                {historyItems.map(item => {
                    const ActionIcon = getActionIcon(item.type);
                    const isExpanded = expandedId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`${styles.card} ${isExpanded ? styles.expanded : ''}`}
                            onClick={() => toggleExpand(item.id)}
                        >
                            <div className={styles.cardMain}>
                                <div className={styles.iconWrapper}>
                                    <ActionIcon size={20} />
                                </div>
                                <div className={styles.details}>
                                    <span className={styles.fileName}>{item.mediaName || 'Unknown file'}</span>
                                    <span className={styles.action}>{getActionLabel(item.type)}</span>
                                </div>
                                <div className={styles.meta}>
                                    <Clock size={14} className={styles.clockIcon} />
                                    <span>{formatTime(item.timestamp)}</span>
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={(e) => handleDelete(item.id, e)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className={styles.expandedContent}>
                                    {item.type === 'caption' && item.caption && (
                                        <div className={styles.expandedSection}>
                                            <span className={styles.expandedLabel}>Caption:</span>
                                            <p className={styles.captionText}>{item.caption}</p>
                                            <div className={styles.expandedActions}>
                                                <CopyButton
                                                    text={item.caption}
                                                    label="Copy Caption"
                                                    size="sm"
                                                />
                                                {item.hashtags && item.hashtags.length > 0 && (
                                                    <CopyButton
                                                        text={item.hashtags.map(t => `#${t.replace('#', '')}`).join(' ')}
                                                        label="Copy Hashtags"
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {item.type === 'edit' && item.prompt && (
                                        <div className={styles.expandedSection}>
                                            <span className={styles.expandedLabel}>Edit prompt:</span>
                                            <p className={styles.promptText}>"{item.prompt}"</p>
                                        </div>
                                    )}
                                    {item.type === 'enhance' && item.improvements && (
                                        <div className={styles.expandedSection}>
                                            <span className={styles.expandedLabel}>Improvements:</span>
                                            <div className={styles.improvementsList}>
                                                {item.improvements.map((imp, idx) => (
                                                    <span key={idx} className={styles.improvementTag}>{imp}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {item.type === 'post' && item.postUrl && (
                                        <div className={styles.expandedSection}>
                                            <span className={styles.expandedLabel}>
                                                Posted to {item.platform}:
                                            </span>
                                            <a
                                                href={item.postUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.postLink}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Post →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
