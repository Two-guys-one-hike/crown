import AuthProvider from "@providers/AuthProvider";
import Routes from "./routes";

function App() {
	return (
		<div className="container mt-5">
			<AuthProvider>
				<Routes />
			</AuthProvider>
		</div>
	);
}

export default App;
