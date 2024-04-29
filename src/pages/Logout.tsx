import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	ApiCallOptionalParameters,
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
		event.preventDefault();

		const catchCallback = (error: any) => {
			console.log("Logout failed:", error);
		};

		const finallyCallback = () => {
			// Remove access and refresh tokens
			setAccessToken(null);
			setRefreshToken(null);
			navigate("/", { replace: true });
		};

		const requestApiCall: ApiCallOptionalParameters = {
			method: "POST",
			data: { refresh: refreshToken },
			catchCallback,
			finallyCallback,
		};
		authApiCall("/api/account/logout/", requestApiCall);
	};

	return (
		<div>
			<form>
				<button
					type="submit"
					className="btn btn-primary"
					onClick={handleLogout}
				>
					Logout
				</button>
			</form>
		</div>
	);
};

export default Logout;
