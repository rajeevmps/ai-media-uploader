import { useRef } from 'react';
import Button from '../ui/Button';
import { UploadCloud, FileVideo, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useToast } from '../ui/Toaster';
import styles from './UploadZone.module.css';

export const UploadZone = ({ onUpload, currentMedia }) => {
    const fileInputRef = useRef(null);
    const { addToast } = useToast();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Basic validation
            const type = file.type.startsWith('video') ? 'video' : 'image';

            // Simulating Object URL
            const mockUrl = URL.createObjectURL(file);

            onUpload({
                name: file.name,
                type: type, // 'image' or 'video'
                url: mockUrl,
                rawFile: file
            });

            addToast(`Successfully uploaded ${file.name}`, 'success');
        }
    };

    // If media exists, we show a "Replace" state
    if (currentMedia) {
        return (
            <div className={styles.previewContainer}>
                <div className={styles.mediaPreview}>
                    {currentMedia.type === 'video' ? (
                        <video src={currentMedia.url} controls className={styles.mediaElement} />
                    ) : (
                        <img src={currentMedia.url} alt="Preview" className={styles.mediaElement} />
                    )}
                </div>
                <div className={styles.previewInfo}>
                    <div className={styles.fileInfo}>
                        {currentMedia.type === 'video' ? <FileVideo size={18} /> : <ImageIcon size={18} />}
                        <span>{currentMedia.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleClick} icon={RefreshCw}>
                        Replace Media
                    </Button>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        aria-label="Media Upload"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.dropzone} onClick={handleClick}>
                <div className={styles.iconWrapper}>
                    <UploadCloud size={48} className={styles.icon} />
                </div>
                <h2 className={styles.title}>Upload Media</h2>
                <p className={styles.subtitle}>Click to select an image or video<br />JPG, PNG, MP4 supported</p>
                <Button variant="primary">Select Files</Button>
                <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    aria-label="Media Upload"
                />
            </div>
        </div>
    );
};
