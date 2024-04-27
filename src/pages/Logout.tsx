import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";
import axios from "axios";

const Logout: React.FC = () => {
	const { refreshToken, setAccessToken, setRefreshToken }: AuthContext =
		useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			await axios.post(
				"http://localhost:8000/api/account/logout/",
				{ refresh: refreshToken },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			setAccessToken(null);
			setRefreshToken(null);
			navigate("/", { replace: true });
		} catch (error) {
			console.log("Logout failed:", error);
		}
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
