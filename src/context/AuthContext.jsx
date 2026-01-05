import { createContext, useContext, useState } from 'react';
import { checkPermission, getPlanLabel } from '../config/planCapabilities';
import { PLANS } from '../config/plans';

const AuthContext = createContext();

export { PLANS }; // Re-export for compatibility

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Demo User',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
    });

    const [currentPlan, setCurrentPlan] = useState(PLANS.STARTER);

    const hasFeature = (feature) => {
        return checkPermission(currentPlan, feature);
    };

    const upgradePlan = (plan) => {
        setCurrentPlan(plan);
    };

    return (
        <AuthContext.Provider value={{ user, currentPlan, hasFeature, upgradePlan, getPlanLabel: () => getPlanLabel(currentPlan) }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
