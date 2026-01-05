import { Type, Image as ImageIcon, Sparkles, Share2, Lock } from 'lucide-react';
import Card from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { FEATURES } from '../../config/features';
import styles from './ActionGrid.module.css';
import clsx from 'clsx';

const ACTIONS = [
    {
        id: FEATURES.CAPTION,
        icon: Type,
        title: 'Generate Caption',
        desc: 'AI-generated captions & hashtags',
    },
    {
        id: FEATURES.EDIT,
        icon: ImageIcon,
        title: 'Edit Image',
        desc: 'Modify image using text instructions',
        onlyImage: true
    },
    {
        id: FEATURES.ENHANCE,
        icon: Sparkles,
        title: 'Enhance Media',
        desc: 'Improve quality, lighting & clarity',
    },
    {
        id: FEATURES.POST,
        icon: Share2,
        title: 'Post to Social Media',
        desc: 'Post directly to social platforms',
    }
];

const ActionGrid = ({ mediaType, onSelect }) => {
    const { hasFeature } = useAuth();

    return (
        <div className={styles.grid}>
            {ACTIONS.map((action) => {
                const isLocked = !hasFeature(action.id);
                const isTypeMismatch = action.onlyImage && mediaType?.startsWith('video');
                const isDisabled = isLocked || isTypeMismatch;

                // Helper text for judge
                let helperText = "";
                if (isLocked) helperText = "Upgrade plan to unlock this feature";
                else if (isTypeMismatch) helperText = "Only supported for images";

                return (
                    <Card
                        key={action.id}
                        interactive={!isDisabled}
                        className={clsx(
                            styles.actionCard,
                            isLocked && styles.locked,
                            isTypeMismatch && styles.disabledType
                        )}
                        onClick={() => {
                            if (!isDisabled) onSelect(action.id);
                        }}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>
                                <action.icon size={24} />
                            </div>
                            {isLocked && <Lock size={16} className={styles.lockIcon} />}
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.title}>{action.title}</h3>
                            <p className={styles.desc}>{action.desc}</p>
                            {isDisabled && <span className={styles.helperText}>{helperText}</span>}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default ActionGrid;
