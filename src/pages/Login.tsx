import { useNavigate, NavigateFunction } from "react-router-dom";
import {
	useAuth,
	AuthContext,
	ApiCallOptionalParameters,
} from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import cn from "classnames";

interface Credentials {
	username: string;
	password: string;
}

const Login: React.FC = () => {
	const baseClass = "form-control";
	const [usernameCN, setUsernameCN] = useState(baseClass);
	const [passwordCN, setPasswordCN] = useState(baseClass);
	const { setAccessToken, setRefreshToken, authApiCall }: AuthContext =
		useAuth();
	const navigate: NavigateFunction = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		resetField,
		formState: { errors, isSubmitted },
	} = useForm();

	const submitCallback = (formData: any) => {
		const credentials = formData as Credentials;

		const thenCallback = (response: any) => {
			// Store access and refresh tokens
			setAccessToken(response.data.access);
			setRefreshToken(response.data.refresh);
			navigate("/", { replace: true });
		};

		const catchCallback = (error: any) => {
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

		const authApiCallParams: ApiCallOptionalParameters = {
			method: "POST",
			data: credentials,
			thenCallback,
			catchCallback,
		};
		authApiCall("/api/account/token/", authApiCallParams);
	};

	useEffect((): void => {
		if (errors.username?.type === "required") {
			setUsernameCN(cn(baseClass, { "is-valid": false, "is-invalid": true }));
		} else if (!errors.username) {
			setUsernameCN(
				cn(baseClass, {
					"is-valid": isSubmitted ? true : false,
					"is-invalid": false,
				})
			);
		}
	}, [errors.username, isSubmitted]);

	useEffect((): void => {
		if (errors.password?.type === "required") {
			setPasswordCN(cn(baseClass, { "is-valid": false, "is-invalid": true }));
		} else if (!errors.password) {
			setPasswordCN(
				cn(baseClass, {
					"is-valid": isSubmitted ? true : false,
					"is-invalid": false,
				})
			);
		}
	}, [errors.password, isSubmitted]);

	return (
		<div>
			<form onSubmit={handleSubmit(submitCallback)}>
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
