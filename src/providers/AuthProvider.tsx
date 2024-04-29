import { Method } from "axios";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import {
	createJWTAxiosInstance,
	JWTAccessToken,
	JWTRefreshToken,
	ResponseStoreTokens,
	ErrorCleanTokens,
} from "@utils/AxiosHelpers";

interface AuthProviderProps {
	children: React.ReactElement;
}

type ThenCallback = (response: any) => void;
type CatchCallback = (error: any) => void;
type FinallyCallback = () => void;

export interface ApiCallOptionalParameters {
	method?: Method;
	data?: object;
	contentType?: string;
	thenCallback?: ThenCallback;
	catchCallback?: CatchCallback;
	finallyCallback?: FinallyCallback;
}

type AuthApiCall = (
	url: string,
	{
		method,
		data,
		contentType,
		thenCallback,
		catchCallback,
		finallyCallback,
	}: ApiCallOptionalParameters
) => Promise<void>;

export interface AuthContext {
	accessToken: string | null;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
	authApiCall: AuthApiCall;
}

// eslint-disable-next-line
const AuthContext = createContext({} as AuthContext);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// State to hold the authentication and refresh tokens
	const [accessToken, setAccessToken] = useState(
		localStorage.getItem("accessToken")
	);
	const [refreshToken, setRefreshToken] = useState(
		localStorage.getItem("refreshToken")
	);

	const authApiCall = useCallback(
		async (
			url: string,
			{
				method,
				data,
				contentType,
				thenCallback,
				catchCallback,
				finallyCallback,
			}: ApiCallOptionalParameters
		) => {
			// Create Axios instance with JWT refresh handler
			const baseUrl = "http://localhost:8000";
			const jwtAccessToken: JWTAccessToken = {
				name: "access",
				token: accessToken ? accessToken : undefined,
			};
			const jwtRefreshToken: JWTRefreshToken = {
				url: "/api/account/token/refresh/",
				data: { refresh: refreshToken },
			};
			const storeTokens: ResponseStoreTokens = (responseData: any) => {
				setAccessToken(responseData.access);
				setRefreshToken(responseData.refresh);
			};
			const cleanTokens: ErrorCleanTokens = () => {
				setAccessToken(null);
				setRefreshToken(null);
			};
			const jwtAxiosInstance = createJWTAxiosInstance(
				baseUrl,
				jwtAccessToken,
				jwtRefreshToken,
				storeTokens,
				cleanTokens
			);

			// Create HTTP request from provided parameters
			await jwtAxiosInstance
				.request({
					url,
					method,
					data,
					headers: {
						"Content-Type": contentType ? contentType : "application/json",
					},
					withCredentials: true,
				})
				.then((response) => {
					if (thenCallback) {
						thenCallback(response);
					}
				})
				.catch((error) => {
					if (catchCallback) {
						catchCallback(error);
					}
				})
				.finally(() => {
					if (finallyCallback) {
						finallyCallback();
					}
				});
		},
		[accessToken, refreshToken]
	);

	useEffect((): void => {
		console.log("access changed:", accessToken);
		console.log("refresh changed:", refreshToken);
		accessToken
			? localStorage.setItem("accessToken", accessToken)
			: localStorage.removeItem("accessToken");
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
			authApiCall,
		}),
		[accessToken, refreshToken, authApiCall]
	);

	// Provide the authentication context to the children components
	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;

export const useAuth = () => {
	return useContext(AuthContext);
};
