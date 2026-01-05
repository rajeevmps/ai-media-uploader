import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toaster';
import styles from './CopyButton.module.css';
import clsx from 'clsx';

/**
 * CopyButton - A button that copies text to clipboard with visual feedback
 * @param {string} text - The text to copy
 * @param {string} label - Optional label to show
 * @param {string} variant - 'icon' | 'button' | 'minimal'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const CopyButton = ({
    text,
    label = 'Copy',
    variant = 'button',
    size = 'md',
    className,
    onCopy,
}) => {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            addToast('Copied to clipboard!', 'success');
            onCopy?.();

            // Reset after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
            addToast('Failed to copy to clipboard', 'error');
        }
    };

    if (variant === 'icon') {
        return (
            <button
                className={clsx(styles.iconButton, styles[size], className)}
                onClick={handleCopy}
                aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
                {copied ? <Check size={size === 'sm' ? 14 : 18} /> : <Copy size={size === 'sm' ? 14 : 18} />}
            </button>
        );
    }

    if (variant === 'minimal') {
        return (
            <button
                className={clsx(styles.minimalButton, styles[size], copied && styles.copied, className)}
                onClick={handleCopy}
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : label}</span>
            </button>
        );
    }

    return (
        <button
            className={clsx(styles.button, styles[size], copied && styles.copied, className)}
            onClick={handleCopy}
        >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : label}</span>
        </button>
    );
};

export default CopyButton;
