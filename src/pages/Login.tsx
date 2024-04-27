import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";
import axios from "axios";
import { useState } from "react";

const Login: React.FC = () => {
	const { setAccessToken, setRefreshToken }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		const user = {
			username,
			password,
		};

		try {
			// Create POST request
			const { data } = await axios.post(
				"http://localhost:8000/api/account/token/",
				user,
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			// Store access and refresh tokens
			setAccessToken(data.access);
			setRefreshToken(data.refresh);
			navigate("/", { replace: true });
		} catch (error) {
			console.log(error);
		}
	};

	const handleUsernameChange = (event: React.FormEvent<HTMLInputElement>) => {
		setUsername(event.currentTarget.value);
	};

	const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
		setPassword(event.currentTarget.value);
	};

	return (
		<div>
			<form onSubmit={handleLogin}>
				<div className="mb-3">
					<label htmlFor="inputUserName" className="form-label">
						Username
					</label>
					<input
						type="text"
						className="form-control"
						id="inputUserName"
						onChange={handleUsernameChange}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="inputPassword" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="inputPassword"
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit" className="btn btn-primary" onClick={handleLogin}>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
