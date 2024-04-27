import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";

const Logout: React.FC = () => {
	const { setAccessToken, setRefreshToken }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogout = (): void => {
		setAccessToken(null);
		setRefreshToken(null);
		navigate("/", { replace: true });
	};

	setTimeout((): void => {
		handleLogout();
	}, 3 * 1000);

	return <>Logout Page</>;
};

export default Logout;
