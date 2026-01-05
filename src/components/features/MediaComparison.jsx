import { useState, useRef, useEffect } from 'react';
import { ArrowLeftRight, ZoomIn, ZoomOut } from 'lucide-react';
import DownloadButton from '../ui/DownloadButton';
import styles from './MediaComparison.module.css';
import clsx from 'clsx';

/**
 * MediaComparison - Before/after slider for comparing original and enhanced media
 */
const MediaComparison = ({
    originalUrl,
    enhancedUrl,
    mediaType = 'image',
    filename = 'enhanced-media',
    improvements = [],
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging]);

    if (mediaType === 'video') {
        // For videos, show side-by-side comparison
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <ArrowLeftRight size={18} className={styles.headerIcon} />
                    <h3 className={styles.title}>Enhanced Video</h3>
                </div>

                <div className={styles.videoComparison}>
                    <div className={styles.videoCard}>
                        <span className={styles.videoLabel}>Original</span>
                        <video src={originalUrl} controls className={styles.video} />
                    </div>
                    <div className={styles.videoCard}>
                        <span className={clsx(styles.videoLabel, styles.enhanced)}>Enhanced</span>
                        <video src={enhancedUrl} controls className={styles.video} />
                    </div>
                </div>

                {improvements.length > 0 && (
                    <div className={styles.improvements}>
                        <span className={styles.improvementsLabel}>Improvements Applied:</span>
                        <div className={styles.improvementTags}>
                            {improvements.map((item, index) => (
                                <span key={index} className={styles.improvementTag}>{item}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.actions}>
                    <DownloadButton
                        url={enhancedUrl}
                        filename={`${filename}.mp4`}
                        label="Download Enhanced Video"
                        variant="primary"
                    />
                </div>
            </div>
        );
    }

    // Image comparison with slider
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <ArrowLeftRight size={18} className={styles.headerIcon} />
                <h3 className={styles.title}>Before & After</h3>
            </div>

            <div
                ref={containerRef}
                className={styles.comparisonWrapper}
                onMouseDown={handleMouseDown}
                onTouchMove={handleTouchMove}
            >
                {/* Original Image (Background) */}
                <div className={styles.imageContainer}>
                    <img src={originalUrl} alt="Original" className={styles.image} />
                    <span className={styles.label}>Original</span>
                </div>

                {/* Enhanced Image (Foreground with clip) */}
                <div
                    className={styles.imageContainer}
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={enhancedUrl} alt="Enhanced" className={styles.image} />
                    <span className={clsx(styles.label, styles.enhanced)}>Enhanced</span>
                </div>

                {/* Slider Handle */}
                <div
                    className={styles.sliderLine}
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className={styles.sliderHandle}>
                        <ArrowLeftRight size={16} />
                    </div>
                </div>
            </div>

            <p className={styles.hint}>Drag the slider to compare</p>

            {improvements.length > 0 && (
                <div className={styles.improvements}>
                    <span className={styles.improvementsLabel}>Improvements Applied:</span>
                    <div className={styles.improvementTags}>
                        {improvements.map((item, index) => (
                            <span key={index} className={styles.improvementTag}>{item}</span>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                <DownloadButton
                    url={enhancedUrl}
                    filename={`${filename}.png`}
                    label="Download Enhanced Image"
                    variant="primary"
                />
            </div>
        </div>
    );
};

export default MediaComparison;
