import axios, { Method } from "axios";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

export interface AuthContext {
	accessToken: string | null;
	setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
	refreshToken: string | null;
	setRefreshToken: React.Dispatch<React.SetStateAction<string | null>>;
	apiCall: ApiCall;
}

interface AuthProviderProps {
	children: React.ReactElement;
}

type ThenCallback = (response: any) => void;
type CatchCallback = (error: any) => void;
type FinallyCallback = () => void;

export interface ApiCallOptionalParameter {
	method?: Method;
	data?: object;
	auth?: boolean;
	contentType?: string;
	thenCallback?: ThenCallback;
	catchCallback?: CatchCallback;
	finallyCallback?: FinallyCallback;
}

type ApiCall = (
	url: string,
	{
		method,
		data,
		auth,
		contentType,
		thenCallback,
		catchCallback,
		finallyCallback,
	}: ApiCallOptionalParameter
) => Promise<void>;

type UpdateTokens = (accessToken: string, refreshToken: string) => void;
type RemoveTokens = () => void;

function createAxiosInstance(
	accessToken?: string,
	refreshToken?: string,
	updateTokens?: UpdateTokens,
	removeTokens?: RemoveTokens
) {
	const axios_instance = axios.create({
		baseURL: "http://localhost:8000",
		timeout: 1000,
		headers: accessToken ? { Authorization: "Bearer " + accessToken } : {},
	});

	const interceptor = axios_instance.interceptors.response.use(
		(response) => response,
		(error) => {
			// Reject promise if usual error
			if (error.response.status !== 401 || !refreshToken) {
				return Promise.reject(error);
			}

			/*
			 * When response code is 401, try to refresh the token.
			 * Eject the interceptor so it doesn't loop in case
			 * token refresh causes the 401 response.
			 */
			axios_instance.interceptors.response.eject(interceptor);
			return axios_instance
				.post(
					"/api/account/token/refresh/",
					{
						refresh: refreshToken,
					},
					{
						headers: { "Content-Type": "application/json" },
						withCredentials: true,
					}
				)
				.then((response) => {
					// Store access and refresh tokens
					if (updateTokens) {
						updateTokens(response.data.access, response.data.refresh);
					}
					error.response.config.headers["Authorization"] =
						"Bearer " + response.data.access;

					// Retry the initial call, but with the updated token in the headers.
					// Resolves the promise if successful
					return axios_instance(error.response.config);
				})
				.catch((error2) => {
					// Retry failed, clean up and reject the promise
					const navigate: NavigateFunction = useNavigate();
					if (removeTokens) {
						removeTokens();
					}
					navigate("/login", { replace: true });
					return Promise.reject(error2);
				});
		}
	);

	return axios_instance;
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

	const apiCall = useCallback(
		async (
			url: string,
			{
				method,
				data,
				auth,
				contentType,
				thenCallback,
				catchCallback,
				finallyCallback,
			}: ApiCallOptionalParameter
		) => {
			const headers = {
				"Content-Type": contentType ? contentType : "application/json",
			};
			const withCredentials = auth ? auth : false;
			const axiosInstance = createAxiosInstance(
				accessToken ? accessToken : undefined,
				refreshToken ? refreshToken : undefined,
				(accessToken, refreshToken) => {
					setAccessToken(accessToken);
					setRefreshToken(refreshToken);
				},
				() => {
					setAccessToken(null);
					setRefreshToken(null);
				}
			);

			await axiosInstance
				.request({
					url,
					method,
					data,
					headers,
					withCredentials,
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
		console.log("token changed:", accessToken, refreshToken);
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
			apiCall,
		}),
		[accessToken, refreshToken]
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
