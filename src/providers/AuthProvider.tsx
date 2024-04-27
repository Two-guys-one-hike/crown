import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface AuthContext {
	accessToken: string | null;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext({} as AuthContext);

const AuthProvider = ({ children }: any) => {
	// State to hold the authentication and refresh tokens
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("accessToken")
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem("refreshToken")
	);

	useEffect(() => {
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
	const contextValue = useMemo(
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
