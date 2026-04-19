import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const contextData = {};

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
