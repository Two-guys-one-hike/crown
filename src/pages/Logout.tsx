import { useNavigate } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const Logout = () => {
	const { setAccessToken, setRefreshToken } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		setAccessToken(null);
		setRefreshToken(null);
		navigate("/", { replace: true });
	};

	setTimeout(() => {
		handleLogout();
	}, 3 * 1000);

	return <>Logout Page</>;
};

export default Logout;
