export enum ActionType {
    TERMS = 'TERMS',
    COMMUNICATE = 'COMMUNICATE',
    PRIVACY_POLICY = 'PRIVACY_POLICY',
    AGE = 'AGE',
}

interface TermsState {
    terms: boolean;
    communicate: boolean;
    privacyPolicy: boolean;
    age: boolean;
}

interface TermsAction {
    type: ActionType;
    payload: boolean;
}

export const termsReducer = (state: TermsState, action: TermsAction) => {
    const { type, payload } = action;

    switch (type) {
        case ActionType.TERMS:
            return {
                ...state,
                terms: payload,
            };
        case ActionType.COMMUNICATE:
            return {
                ...state,
                communicate: payload,
            };
        case ActionType.PRIVACY_POLICY:
            return {
                ...state,
                privacyPolicy: payload,
            };
        case ActionType.AGE:
            return {
                ...state,
                age: payload,
            };
        default:
            return state;
    }
};
