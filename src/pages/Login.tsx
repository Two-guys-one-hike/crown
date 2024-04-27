import { useNavigate } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const Login = () => {
	const { setAccessToken, setRefreshToken } = useAuth();
	const navigate = useNavigate();

	const handleLogin = () => {
		setAccessToken("this is a test access token");
		setRefreshToken("this is a test refresh token");
		navigate("/", { replace: true });
	};

	setTimeout(() => {
		handleLogin();
	}, 3 * 1000);

	return <>Login Page</>;
};

export default Login;
