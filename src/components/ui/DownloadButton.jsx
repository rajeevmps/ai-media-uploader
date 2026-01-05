import { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { useToast } from './Toaster';
import styles from './DownloadButton.module.css';
import clsx from 'clsx';

/**
 * DownloadButton - A button that downloads files with visual feedback
 * @param {string} url - The URL of the file to download
 * @param {string} filename - The filename for the downloaded file
 * @param {string} label - Optional label to show
 * @param {string} variant - 'icon' | 'button' | 'primary'
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
const DownloadButton = ({
    url,
    filename = 'download',
    label = 'Download',
    variant = 'button',
    size = 'md',
    className,
    onDownload,
}) => {
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const { addToast } = useToast();

    const handleDownload = async () => {
        if (!url) {
            addToast('No file available to download', 'error');
            return;
        }

        setDownloading(true);

        try {
            // Fetch the file to ensure we can download it
            const response = await fetch(url);
            const blob = await response.blob();

            // Create download link
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

            setDownloaded(true);
            addToast(`Downloaded ${filename}`, 'success');
            onDownload?.();

            // Reset after 3 seconds
            setTimeout(() => setDownloaded(false), 3000);
        } catch (error) {
            console.error('Download failed:', error);

            // Fallback: try direct link download
            try {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setDownloaded(true);
                addToast(`Downloaded ${filename}`, 'success');
                onDownload?.();

                setTimeout(() => setDownloaded(false), 3000);
            } catch (fallbackError) {
                addToast('Failed to download file', 'error');
            }
        } finally {
            setDownloading(false);
        }
    };

    const getIcon = () => {
        if (downloading) return <Loader2 size={size === 'sm' ? 14 : 18} className={styles.spinner} />;
        if (downloaded) return <Check size={size === 'sm' ? 14 : 18} />;
        return <Download size={size === 'sm' ? 14 : 18} />;
    };

    const getLabel = () => {
        if (downloading) return 'Downloading...';
        if (downloaded) return 'Downloaded!';
        return label;
    };

    if (variant === 'icon') {
        return (
            <button
                className={clsx(styles.iconButton, styles[size], className)}
                onClick={handleDownload}
                disabled={downloading}
                aria-label={getLabel()}
                title={getLabel()}
            >
                {getIcon()}
            </button>
        );
    }

    if (variant === 'primary') {
        return (
            <button
                className={clsx(
                    styles.primaryButton,
                    styles[size],
                    downloaded && styles.downloaded,
                    downloading && styles.loading,
                    className
                )}
                onClick={handleDownload}
                disabled={downloading}
            >
                {getIcon()}
                <span>{getLabel()}</span>
            </button>
        );
    }

    return (
        <button
            className={clsx(
                styles.button,
                styles[size],
                downloaded && styles.downloaded,
                downloading && styles.loading,
                className
            )}
            onClick={handleDownload}
            disabled={downloading}
        >
            {getIcon()}
            <span>{getLabel()}</span>
        </button>
    );
};

export default DownloadButton;
