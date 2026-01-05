import { useState } from 'react';
import { LayoutDashboard, History, Zap, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PLANS } from '../../config/plans';
import { useToast } from '../ui/Toaster';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        className={clsx(styles.navItem, active && styles.active)}
        onClick={onClick}
    >
        <Icon size={20} />
        <span className={styles.label}>{label}</span>
    </button>
);

const Sidebar = ({ activeTab = 'dashboard', onNavigate }) => {
    const [showMenu, setShowMenu] = useState(false);
    const { addToast } = useToast();

    const handleLogout = (e) => {
        e.stopPropagation();
        addToast("Logged out successfully", "success");
        setShowMenu(false);
    };

    const handleSettings = (e) => {
        e.stopPropagation();
        addToast("Settings panel coming soon!", "info");
        setShowMenu(false);
    };

    return (
        <aside className={styles.sidebar} onClick={() => setShowMenu(false)}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Zap size={24} color="white" fill="white" />
                </div>
                <span className={styles.logoText}>SocialAI</span>
            </div>

            <nav className={styles.nav}>
                <div className={styles.section}>
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={activeTab === 'dashboard'}
                        onClick={() => onNavigate?.('dashboard')}
                    />
                    <NavItem
                        icon={History}
                        label="History"
                        active={activeTab === 'history'}
                        onClick={() => onNavigate?.('history')}
                    />
                </div>
            </nav>

            <div className={styles.footer}>
                {/* Plan Card moved to Header */}

                <div
                    className={styles.userProfile}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                >
                    {showMenu && (
                        <div className={styles.userMenu}>
                            <button className={styles.menuItem} onClick={handleSettings}>
                                <Settings size={16} />
                                <span>Settings</span>
                            </button>
                            <button className={clsx(styles.menuItem, styles.danger)} onClick={handleLogout}>
                                <LogOut size={16} />
                                <span>Log Out</span>
                            </button>
                        </div>
                    )}
                    <div className={styles.avatar} />
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Demo User</span>
                        <span className={styles.userEmail}>demo@social.ai</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
