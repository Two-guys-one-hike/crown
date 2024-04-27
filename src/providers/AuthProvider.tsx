import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface AuthContext {
	accessToken: string | null;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
}

interface AuthProviderProps {
	children: React.ReactElement;
}

const AuthContext = createContext({} as AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// State to hold the authentication and refresh tokens
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("accessToken")
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem("refreshToken")
	);

	useEffect((): void => {
		if (accessToken) {
			axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
			localStorage.setItem("accessToken", accessToken);
		} else {
			delete axios.defaults.headers.common["Authorization"];
			localStorage.removeItem("accessToken");
		}
		refreshToken
			? localStorage.setItem("refreshToken", refreshToken)
			: localStorage.removeItem("refreshToken");
	}, [accessToken, refreshToken]);

	// Memoized value of the authentication context
	const contextValue: AuthContext = useMemo(
		() => ({
			accessToken,
			setAccessToken,
			refreshToken,
			setRefreshToken,
		}),
		[accessToken, refreshToken]
	);

	// Provide the authentication context to the children components
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};

export default AuthProvider;
