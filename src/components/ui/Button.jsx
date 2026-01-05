import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary', // primary, secondary, ghost, glass
    size = 'md', // sm, md, lg
    className,
    isLoading = false,
    disabled,
    icon: Icon,
    ...props
}) => {
    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                isLoading && styles.loading,
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className={styles.spinner} size={16} />}
            {!isLoading && Icon && <Icon className={styles.icon} size={18} />}
            {children}
        </button>
    );
};

export default Button;
