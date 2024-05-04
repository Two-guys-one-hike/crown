import {
	useAuth,
	AuthContext,
	AuthAPICallParams,
} from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";

const Home: React.FC = () => {
	const { accessToken, authApiCall }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();
	const [homeContent, setHomeContent] = useState("Home page as Guest");

	const handleLogin = () => {
		navigate("/login/", { replace: true });
	};

	const handleLogout = () => {
		navigate("/logout/", { replace: true });
	};

	const handleRequestHome = () => {
		const thenCallback = (response: any) => {
			setHomeContent(response.data.message);
		};

		const catchCallback = (error: any) => {
			setHomeContent("Home page as Guest");
		};

		const requestApiCall: AuthAPICallParams = {
			method: "GET",
			thenCallback,
			catchCallback,
		};
		authApiCall("/api/home", requestApiCall);
	};

	return (
		<div className="text-center">
			<h1>Welcome to Two Guys One Hike!</h1>
			<h2>{homeContent}</h2>
			{!accessToken ? (
				<button className="btn btn-primary mt-3" onClick={handleLogin}>
					Login
				</button>
			) : (
				<button className="btn btn-primary mt-3" onClick={handleLogout}>
					Logout
				</button>
			)}
			<div className="mt-4 row">
				<div className="col-3">
					<button className="btn btn-warning mt-3" onClick={handleRequestHome}>
						Request home
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
