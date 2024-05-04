import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";

const Logout: React.FC = () => {
	const {
		refreshToken,
		setAccessToken,
		setRefreshToken,
		authApiCall,
	}: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = (event: React.FormEvent) => {
		const catchCallback = (error: any) => {
			console.log("Logout failed:", error);
		};

		const finallyCallback = () => {
			// Clean access and refresh tokens
			setAccessToken(null);
			setRefreshToken(null);
			navigate("/", { replace: true });
		};

		const authApiCallParams: AuthAPICallParams = {
			method: "POST",
			data: { refresh: refreshToken },
			injectRefresh: true,
			catchCallback,
			finallyCallback,
		};
		authApiCall("/api/account/logout/", authApiCallParams);
	};

	return (
		<div>
			<button type="submit" className="btn btn-primary" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default Logout;
