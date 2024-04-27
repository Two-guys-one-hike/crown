import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";

const Login: React.FC = () => {
	const { setAccessToken, setRefreshToken }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();

	const handleLogin = (): void => {
		setAccessToken("this is a test access token");
		setRefreshToken("this is a test refresh token");
		navigate("/", { replace: true });
	};

	setTimeout((): void => {
		handleLogin();
	}, 3 * 1000);

	return <>Login Page</>;
};

export default Login;
