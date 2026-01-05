import Sidebar from './Sidebar';
import Header from './Header'; // Now importing Header
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, rightPanel, workflowStatus, activeTab, onNavigate }) => {
    return (
        <div className={styles.layout}>
            <Sidebar activeTab={activeTab} onNavigate={onNavigate} />

            <div className={styles.contentWrapper}>
                <Header workflowStatus={workflowStatus} />
                <div className={styles.workspace}>
                    <main className={styles.main}>
                        {children}
                    </main>
                    <aside className={styles.rightPanel}>
                        {rightPanel}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
