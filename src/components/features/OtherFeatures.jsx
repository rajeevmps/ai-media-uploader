import { useState } from 'react';
import Button from '../ui/Button';
import { ProcessingSteps } from '../ui/ProcessingSteps';
import MediaComparison from './MediaComparison';
import PostConfirmation from './PostConfirmation';
import DownloadButton from '../ui/DownloadButton';
import { editImage, enhanceMedia, postToSocial } from '../../services/api';
import { addToHistory } from '../../services/storage';
import { CheckCircle2, Wand2 } from 'lucide-react';
import styles from './Features.module.css';

// ============================================
// IMAGE EDITOR
// ============================================
export const ImageEditor = ({ onStart, onResult, media }) => {
    const [prompt, setPrompt] = useState('');
    const [status, setStatus] = useState('idle'); // idle, processing, completed, error
    const [editResult, setEditResult] = useState(null);

    const handleApply = async () => {
        if (!prompt.trim()) return;

        setStatus('processing');
        onStart?.();
    };

    const handleProcessingComplete = async () => {
        try {
            const result = await editImage(media?.rawFile, prompt);

            if (result.success) {
                setEditResult(result);
                setStatus('completed');
                onResult?.(result);

                addToHistory({
                    type: 'edit',
                    mediaName: media?.name || 'Unknown',
                    prompt: prompt,
                    editedUrl: result.editedImageUrl,
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Image editing failed:', error);
            setStatus('error');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setPrompt('');
        setEditResult(null);
    };

    const processingSteps = [
        'Analyzing image structure...',
        'Processing edit instructions...',
        'Applying AI modifications...',
        'Finalizing edited image...'
    ];

    const promptExamples = [
        "Make the background darker",
        "Remove unwanted objects",
        "Add a vintage filter",
        "Make it look more professional",
    ];

    if (status === 'processing') {
        return (
            <div className={styles.container}>
                <h3>Editing Image</h3>
                <div className={styles.content}>
                    <div className="flex-center h-full">
                        <ProcessingSteps steps={processingSteps} onComplete={handleProcessingComplete} />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'completed' && editResult) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>Edit Complete</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                        Edit Again
                    </Button>
                </div>
                <div className={styles.content}>
                    <MediaComparison
                        originalUrl={editResult.originalUrl}
                        enhancedUrl={editResult.editedImageUrl}
                        mediaType="image"
                        filename={`edited-${media?.name || 'image'}`}
                        improvements={[`"${prompt}"`]}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3>Image Editor</h3>
            <div className={styles.content}>
                <div className={styles.editorInstructions}>
                    <Wand2 size={24} className={styles.instructionIcon} />
                    <p>Describe how you want to modify the image:</p>
                </div>

                <div className={styles.promptExamples}>
                    {promptExamples.map((example, idx) => (
                        <button
                            key={idx}
                            className={styles.exampleChip}
                            onClick={() => setPrompt(example)}
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.editorControls}>
                <textarea
                    className={styles.promptInput}
                    placeholder="e.g., Remove the background and add a gradient..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                />
                <Button
                    onClick={handleApply}
                    disabled={!prompt.trim()}
                    className="w-full"
                >
                    Apply Edit
                </Button>
            </div>
        </div>
    );
};

// ============================================
// MEDIA ENHANCER
// ============================================
export const MediaEnhancer = ({ onStart, onResult, media }) => {
    const [status, setStatus] = useState('idle');
    const [enhanceResult, setEnhanceResult] = useState(null);
    const [options, setOptions] = useState({
        level: 'auto',
        upscale: false,
        denoise: true,
    });

    const handleEnhance = () => {
        setStatus('processing');
        onStart?.();
    };

    const handleProcessingComplete = async () => {
        try {
            const result = await enhanceMedia(media?.rawFile, options);

            if (result.success) {
                setEnhanceResult(result);
                setStatus('completed');
                onResult?.(result);

                addToHistory({
                    type: 'enhance',
                    mediaName: media?.name || 'Unknown',
                    mediaType: result.mediaType,
                    improvements: result.improvements,
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Enhancement failed:', error);
            setStatus('error');
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setEnhanceResult(null);
    };

    const processingSteps = [
        'Analyzing media quality...',
        'Detecting areas for improvement...',
        'Enhancing clarity and colors...',
        'Optimizing final output...'
    ];

    if (status === 'processing') {
        return (
            <div className={styles.container}>
                <h3>Enhancing {media?.type === 'video' ? 'Video' : 'Image'}</h3>
                <div className={styles.content}>
                    <div className="flex-center h-full">
                        <ProcessingSteps steps={processingSteps} onComplete={handleProcessingComplete} />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'completed' && enhanceResult) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>Enhancement Complete</h3>
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                        Enhance Another
                    </Button>
                </div>
                <div className={styles.content}>
                    <MediaComparison
                        originalUrl={enhanceResult.originalUrl}
                        enhancedUrl={enhanceResult.enhancedUrl}
                        mediaType={enhanceResult.mediaType}
                        filename={`enhanced-${media?.name || 'media'}`}
                        improvements={enhanceResult.improvements}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h3>Media Enhancer</h3>
            <div className={styles.content}>
                <div className={styles.enhancePreview}>
                    {media?.type === 'video' ? (
                        <video src={media.url} className={styles.previewMedia} />
                    ) : (
                        <img src={media?.url} alt="Preview" className={styles.previewMedia} />
                    )}
                    <div className={styles.previewOverlay}>
                        <span>Original</span>
                    </div>
                </div>

                <div className={styles.enhanceOptions}>
                    <h4>Enhancement Options</h4>
                    <label className={styles.optionRow}>
                        <span>Enhancement Level:</span>
                        <select
                            value={options.level}
                            onChange={(e) => setOptions(o => ({ ...o, level: e.target.value }))}
                            className={styles.select}
                        >
                            <option value="auto">Auto (Recommended)</option>
                            <option value="light">Light</option>
                            <option value="medium">Medium</option>
                            <option value="heavy">Heavy</option>
                        </select>
                    </label>
                    <label className={styles.optionRow}>
                        <input
                            type="checkbox"
                            checked={options.denoise}
                            onChange={(e) => setOptions(o => ({ ...o, denoise: e.target.checked }))}
                        />
                        <span>Reduce noise</span>
                    </label>
                    <label className={styles.optionRow}>
                        <input
                            type="checkbox"
                            checked={options.upscale}
                            onChange={(e) => setOptions(o => ({ ...o, upscale: e.target.checked }))}
                        />
                        <span>Upscale resolution</span>
                    </label>
                </div>
            </div>
            <Button className="w-full" onClick={handleEnhance}>
                Enhance {media?.type === 'video' ? 'Video' : 'Image'}
            </Button>
        </div>
    );
};

// ============================================
// SOCIAL POSTER
// ============================================
export const SocialPoster = ({ initialCaption, onStart, onResult, media }) => {
    const [platform, setPlatform] = useState('instagram');
    const [caption, setCaption] = useState(initialCaption || '');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('idle');
    const [postResult, setPostResult] = useState(null);

    const handlePost = () => {
        setStatus('processing');
        onStart?.();
    };

    const handleProcessingComplete = async () => {
        try {
            const result = await postToSocial(media?.rawFile, {
                platform,
                caption,
                title: platform === 'youtube' ? title : undefined,
                hashtags: caption.match(/#\w+/g) || [],
            });

            if (result.success) {
                setPostResult(result);
                setStatus('completed');
                onResult?.(result);

                addToHistory({
                    type: 'post',
                    mediaName: media?.name || 'Unknown',
                    platform,
                    postUrl: result.postUrl,
                    caption,
                });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Posting failed:', error);
            setStatus('error');
        }
    };

    const handlePostAnother = () => {
        setStatus('idle');
        setPostResult(null);
    };

    const handleGoBack = () => {
        setStatus('idle');
        setPostResult(null);
        onResult?.();
    };

    const processingSteps = [
        `Connecting to ${platform === 'instagram' ? 'Instagram' : 'YouTube'}...`,
        'Uploading media assets...',
        'Verifying content policies...',
        'Publishing post...'
    ];

    if (status === 'processing') {
        return (
            <div className={styles.container}>
                <h3>Posting to {platform === 'instagram' ? 'Instagram' : 'YouTube'}</h3>
                <div className={styles.content}>
                    <div className="flex-center h-full">
                        <ProcessingSteps steps={processingSteps} onComplete={handleProcessingComplete} />
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'completed' && postResult) {
        return (
            <PostConfirmation
                postUrl={postResult.postUrl}
                platform={platform}
                caption={caption}
                publishedAt={postResult.publishedAt}
                onPostAnother={handlePostAnother}
                onGoBack={handleGoBack}
            />
        );
    }

    return (
        <div className={styles.container}>
            <h3>Social Poster</h3>
            <div className={styles.content}>
                <div className={styles.scrollableContent}>
                    <div className={styles.inputGroup}>
                        <p className={styles.label}>Select Platform:</p>
                        <div className={styles.platformSelector}>
                            <Button
                                type="button"
                                variant={platform === 'instagram' ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setPlatform('instagram')}
                            >
                                📷 Instagram
                            </Button>
                            <Button
                                type="button"
                                variant={platform === 'youtube' ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => setPlatform('youtube')}
                            >
                                ▶️ YouTube
                            </Button>
                        </div>
                    </div>

                    {platform === 'youtube' && (
                        <div className="animate-in fade-in">
                            <p className={styles.label}>Video Title:</p>
                            <input
                                className={styles.input}
                                placeholder="Enter an engaging title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    )}

                    <div className={styles.flexCol}>
                        <p className={styles.label}>
                            {platform === 'instagram' ? 'Caption & Hashtags:' : 'Description:'}
                        </p>
                        <label htmlFor="caption-input" className="sr-only">Caption</label>
                        <textarea
                            id="caption-input"
                            className={styles.socialTextarea}
                            style={{ flex: 1 }}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={platform === 'instagram' ? "Write a caption..." : "Video description..."}
                        />
                    </div>
                </div>
            </div>
            <Button variant="primary" className="w-full" onClick={handlePost}>
                {platform === 'instagram' ? '📤 Post to Instagram' : '🚀 Publish Video'}
            </Button>
        </div>
    );
};
