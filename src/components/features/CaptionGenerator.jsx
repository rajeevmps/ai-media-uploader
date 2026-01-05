import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { RefreshCw, Sliders } from 'lucide-react';
import { ProcessingSteps } from '../ui/ProcessingSteps';
import CaptionOutput from './CaptionOutput';
import { generateCaption } from '../../services/api';
import { addToHistory } from '../../services/storage';
import styles from './Features.module.css';

const CaptionGenerator = ({ onStart, onResult, media }) => {
    const [status, setStatus] = useState('processing'); // 'processing' | 'completed' | 'error'
    const [captionData, setCaptionData] = useState({ caption: '', hashtags: [] });
    const [settings, setSettings] = useState({
        tone: 'professional',
        platform: 'instagram',
        includeEmojis: true,
    });
    const [showSettings, setShowSettings] = useState(false);

    const generate = async () => {
        setStatus('processing');
        onStart?.();
    };

    const handleProcessingComplete = async () => {
        try {
            // Call the actual API (will use mock in dev mode if n8n is not available)
            const result = await generateCaption(media?.rawFile, settings);

            if (result.success) {
                setCaptionData({
                    caption: result.caption,
                    hashtags: result.hashtags,
                });
                setStatus('completed');
                onResult?.(result.caption);

                // Save to history
                addToHistory({
                    type: 'caption',
                    mediaName: media?.name || 'Unknown',
                    caption: result.caption,
                    hashtags: result.hashtags,
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Caption generation failed:', error);
            setStatus('error');
        }
    };

    const handleRegenerate = () => {
        setCaptionData({ caption: '', hashtags: [] });
        generate();
    };

    useEffect(() => {
        generate();
    }, []);

    const steps = [
        'Analyzing media content...',
        'Identifying key subjects...',
        'Generating relevant hashtags...',
        'Crafting engaging caption...'
    ];

    const toneOptions = [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'humorous', label: 'Humorous' },
        { value: 'inspirational', label: 'Inspirational' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Caption Generator</h3>
                <div className={styles.headerActions}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        title="Settings"
                    >
                        <Sliders size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={status === 'processing'}
                    >
                        <RefreshCw size={16} className={status === 'processing' ? styles.spin : ""} />
                        Regenerate
                    </Button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && status !== 'processing' && (
                <div className={styles.settingsPanel}>
                    <div className={styles.settingRow}>
                        <label>Tone:</label>
                        <select
                            value={settings.tone}
                            onChange={(e) => setSettings(s => ({ ...s, tone: e.target.value }))}
                            className={styles.select}
                        >
                            {toneOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.settingRow}>
                        <label>Platform:</label>
                        <select
                            value={settings.platform}
                            onChange={(e) => setSettings(s => ({ ...s, platform: e.target.value }))}
                            className={styles.select}
                        >
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                        </select>
                    </div>
                    <div className={styles.settingRow}>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.includeEmojis}
                                onChange={(e) => setSettings(s => ({ ...s, includeEmojis: e.target.checked }))}
                            />
                            Include emojis
                        </label>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                {status === 'processing' ? (
                    <div className="flex-center h-full p-4">
                        <ProcessingSteps steps={steps} onComplete={handleProcessingComplete} />
                    </div>
                ) : status === 'error' ? (
                    <div className={styles.errorState}>
                        <p>Failed to generate caption. Please try again.</p>
                        <Button variant="secondary" onClick={handleRegenerate}>
                            Retry
                        </Button>
                    </div>
                ) : (
                    <CaptionOutput
                        caption={captionData.caption}
                        hashtags={captionData.hashtags}
                        onRegenerate={handleRegenerate}
                        mediaName={media?.name}
                    />
                )}
            </div>
        </div>
    );
};

export default CaptionGenerator;
