import { useState, useRef, useEffect } from 'react';
import { Zap, ChevronDown, CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PLANS } from '../../config/plans';
import { WORKFLOW_STATUS } from '../../hooks/useWorkflowState';
import clsx from 'clsx';
import styles from './Header.module.css';

const Header = ({ workflowStatus }) => {
    const { currentPlan, upgradePlan } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.logoIcon}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span className={styles.logoText}>AI Image-to-Post</span>
            </div>

            <div className={styles.center}>
                <WorkflowIndicator status={workflowStatus} />
            </div>

            <div className={styles.right}>
                <div className={styles.planSelector}>
                    <span className={styles.planLabel}>Current Plan:</span>
                    <PlanDropdown currentPlan={currentPlan} onSelect={upgradePlan} />
                </div>
            </div>
        </header>
    );
};

const PlanDropdown = ({ currentPlan, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus management
    useEffect(() => {
        if (isOpen && menuRef.current) {
            const firstItem = menuRef.current.querySelector('[role="menuitem"]');
            firstItem?.focus();
        } else if (!isOpen && triggerRef.current) {
            triggerRef.current.focus();
        }
    }, [isOpen]);

    const options = [
        { value: PLANS.STARTER, label: 'Starter' },
        { value: PLANS.PRO, label: 'Pro' },
        { value: PLANS.ULTIMATE, label: 'Ultimate' },
    ];

    const currentLabel = options.find(o => o.value === currentPlan)?.label || 'Starter';

    const handleTriggerKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
        }
    };

    const handleMenuKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button
                ref={triggerRef}
                className={styles.dropdownTrigger}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleTriggerKeyDown}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Select Plan"
            >
                {currentLabel}
                <ChevronDown size={14} className={clsx(styles.selectIcon, isOpen && styles.rotate)} />
            </button>

            <div className={clsx(styles.badge, styles[currentPlan])}>
                {currentPlan === PLANS.ULTIMATE ? 'MAX' : currentPlan.toUpperCase()}
            </div>

            {isOpen && (
                <ul
                    ref={menuRef}
                    className={styles.dropdownMenu}
                    role="menu"
                    onKeyDown={handleMenuKeyDown}
                >
                    {options.map((option, index) => (
                        <li
                            key={option.value}
                            className={clsx(styles.dropdownItem, currentPlan === option.value && styles.selected)}
                            onClick={() => {
                                onSelect(option.value);
                                setIsOpen(false);
                            }}
                            role="menuitem"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const next = e.target.nextElementSibling;
                                    next?.focus();
                                }
                                if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const prev = e.target.previousElementSibling;
                                    prev?.focus();
                                }
                            }}
                        >
                            {option.label}
                            {currentPlan === option.value && <CheckCircle2 size={14} />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const WorkflowIndicator = ({ status }) => {
    const steps = [
        { id: WORKFLOW_STATUS.UPLOADED, label: 'Uploaded' },
        { id: WORKFLOW_STATUS.PROCESSING, label: 'Processing' },
        { id: WORKFLOW_STATUS.COMPLETED, label: 'Completed' },
    ];

    /* Logic: Active if current or past */
    const getStepState = (stepId, index) => {
        const order = [WORKFLOW_STATUS.IDLE, WORKFLOW_STATUS.UPLOADED, WORKFLOW_STATUS.PROCESSING, WORKFLOW_STATUS.COMPLETED];
        const currentIndex = order.indexOf(status);
        const stepIndex = order.indexOf(stepId);

        if (status === WORKFLOW_STATUS.ERROR && stepIndex === currentIndex) return 'error';
        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'active';
        return 'pending';
    };

    return (
        <div className={styles.indicator}>
            {steps.map((step, idx) => {
                const state = getStepState(step.id);
                return (
                    <div key={step.id} className={clsx(styles.step, styles[state])}>
                        <div className={styles.stepIcon}>
                            {state === 'completed' && <CheckCircle2 size={14} />}
                            {state === 'active' && (status === WORKFLOW_STATUS.PROCESSING ? <Loader2 size={14} className="spin" /> : <CircleDashed size={14} />)}
                            {state === 'pending' && <CircleDashed size={14} />}
                        </div>
                        <span className={styles.stepLabel}>{step.label}</span>
                        {idx < steps.length - 1 && <div className={styles.connector} />}
                    </div>
                )
            })}
        </div>
    );
};

export default Header;
