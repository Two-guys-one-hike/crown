import { useAuth, AuthContext } from "@providers/AuthProvider";
import { useNavigate, NavigateFunction } from "react-router-dom";

const Home: React.FC = () => {
	const { accessToken }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogin = () => {
		navigate("/login/", { replace: true });
	};

	const handleLogout = () => {
		navigate("/logout/", { replace: true });
	};

	return (
		<div className="text-center">
			<h1>Welcome to Two Guys One Hike!</h1>
			{!accessToken ? (
				<button className="btn btn-primary mt-3" onClick={handleLogin}>
					Login
				</button>
			) : (
				<button className="btn btn-primary mt-3" onClick={handleLogout}>
					Logout
				</button>
			)}
		</div>
	);
};

export default Home;
