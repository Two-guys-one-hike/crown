import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	ApiCallOptionalParameter,
} from "@providers/AuthProvider";

const Logout: React.FC = () => {
	const {
		refreshToken,
		setAccessToken,
		setRefreshToken,
		apiCall,
	}: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = async (event: React.FormEvent) => {
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

		const requestApiCall: ApiCallOptionalParameter = {
			method: "POST",
			data: { refresh: refreshToken },
			auth: true,
			catchCallback,
			finallyCallback,
		};
		await apiCall("/api/account/logout/", requestApiCall);
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
