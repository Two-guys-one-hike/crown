import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	ApiCallOptionalParameter,
} from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import cn from "classnames";

interface Credentials {
	username: string;
	password: string;
}

const Login: React.FC = () => {
	const { setAccessToken, setRefreshToken, apiCall }: AuthContext = useAuth();
	const navigate: NavigateFunction = useNavigate();
	const [usernameCN, setUsernameCN] = useState("form-control");
	const [passwordCN, setPasswordCN] = useState("form-control");

	const {
		register,
		handleSubmit,
		setError,
		reset,
		resetField,
		formState: { errors, isSubmitted },
	} = useForm();

	const onSubmit = async (formData: any) => {
		const credentials = formData as Credentials;

		const thenCallback = (response: any) => {
			// Store access and refresh tokens
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			reset();
			navigate("/", { replace: true });
		};

		const catchCallback = (error: any) => {
			console.log(error.response.data.detail);
			resetField("password");
			setError("password", {
				type: "generic",
				message: error.response?.data?.detail
					? error.response.data.detail
					: "Error occurred during login.",
			});
			setPasswordCN(
				cn("form-control", {
					"is-valid": false,
					"is-invalid": true,
				})
			);
			console.error(error);
		};

		const requestApiCall: ApiCallOptionalParameter = {
			method: "POST",
			data: credentials,
			auth: true,
			thenCallback,
			catchCallback,
		};
		await apiCall("/api/account/token/", requestApiCall);
	};

	useEffect((): void => {
		if (errors.username?.type === "required") {
			setUsernameCN(
				cn("form-control", { "is-valid": false, "is-invalid": true })
			);
		} else if (!errors.username) {
			setUsernameCN(
				cn("form-control", {
					"is-valid": isSubmitted ? true : false,
					"is-invalid": false,
				})
			);
		}
	}, [errors.username]);

	useEffect((): void => {
		if (errors.password?.type === "required") {
			setPasswordCN(
				cn("form-control", { "is-valid": false, "is-invalid": true })
			);
		} else if (!errors.password) {
			setPasswordCN(
				cn("form-control", {
					"is-valid": isSubmitted ? true : false,
					"is-invalid": false,
				})
			);
		}
	}, [errors.password]);

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-3">
					<label htmlFor="inputUserName" className="form-label">
						Username
					</label>
					<input
						type="text"
						className={usernameCN}
						id="inputUserName"
						{...register("username", { required: true })}
					/>
					{errors.username?.type === "required" && (
						<p className="invalid-feedback">Username is required.</p>
					)}
				</div>
				<div className="mb-3">
					<label htmlFor="inputPassword" className="form-label">
						Password
					</label>
					<input
						type="password"
						className={passwordCN}
						id="inputPassword"
						{...register("password", { required: true })}
					/>
					{errors.password?.type === "required" && (
						<p className="invalid-feedback">Password is required.</p>
					)}
					{errors.password?.type === "generic" && (
						<p className="invalid-feedback">
							{errors.password.message?.toString()}
						</p>
					)}
				</div>
				<div className="mb-4"></div>
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
