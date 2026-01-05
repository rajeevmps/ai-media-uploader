import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import styles from './ProcessingSteps.module.css';
import clsx from 'clsx';

export const ProcessingSteps = ({ steps, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep < steps.length) {
            const timer = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 800 + Math.random() * 500); // Randomize slightly for realism
            return () => clearTimeout(timer);
        } else {
            onComplete?.();
        }
    }, [currentStep, steps.length, onComplete]);

    return (
        <div className={styles.container}>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                    <div key={index} className={clsx(styles.stepRow, isCurrent && styles.activeRow)}>
                        <div className={styles.iconWrapper}>
                            {isCompleted && <CheckCircle2 className={styles.completedIcon} size={18} />}
                            {isCurrent && <Loader2 className={styles.spinner} size={18} />}
                            {isPending && <Circle className={styles.pendingIcon} size={18} />}
                        </div>
                        <span className={clsx(styles.label, {
                            [styles.completedText]: isCompleted,
                            [styles.activeText]: isCurrent,
                            [styles.pendingText]: isPending
                        })}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
