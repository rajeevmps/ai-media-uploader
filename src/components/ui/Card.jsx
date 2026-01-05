import clsx from 'clsx';
import styles from './Card.module.css';

const Card = ({ children, className, onClick, interactive = false, ...props }) => {
    return (
        <div
            className={clsx(
                styles.card,
                interactive && styles.interactive,
                className
            )}
            onClick={interactive ? onClick : undefined}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
