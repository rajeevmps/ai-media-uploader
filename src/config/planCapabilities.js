import { FEATURES } from './features';
import { PLANS } from './plans';

export const PLAN_CONFIG = {
    [PLANS.STARTER]: [FEATURES.CAPTION],
    [PLANS.PRO]: [FEATURES.CAPTION, FEATURES.EDIT, FEATURES.ENHANCE],
    [PLANS.ULTIMATE]: [FEATURES.CAPTION, FEATURES.EDIT, FEATURES.ENHANCE, FEATURES.POST],
};

export const checkPermission = (plan, feature) => {
    const allowed = PLAN_CONFIG[plan] || [];
    return allowed.includes(feature);
};

export const getPlanLabel = (plan) => {
    switch (plan) {
        case PLANS.STARTER: return 'Starter Plan';
        case PLANS.PRO: return 'Pro Plan';
        case PLANS.ULTIMATE: return 'Ultimate Plan';
        default: return 'Unknown Plan';
    }
};
