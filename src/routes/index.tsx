import {
	RouterProvider,
	createBrowserRouter,
	RouteObject,
} from "react-router-dom";
import { useAuth, AuthContext } from "@providers/AuthProvider";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import Login from "@pages/Login";
import Logout from "@pages/Logout";

const Routes: React.FC = () => {
	const { accessToken }: AuthContext = useAuth();

	// Define public routes accessible to all users
	const routesForPublic: RouteObject[] = [
		{
			path: "/service",
			element: <div>Service Page</div>,
		},
		{
			path: "/about-us",
			element: <div>About Us</div>,
		},
	];

	// Define routes accessible only to authenticated users
	const routesForAuthenticatedOnly: RouteObject[] = [
		{
			path: "/",
			element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
			children: [
				{
					path: "/",
					element: <div>User Home Page</div>,
				},
				{
					path: "/profile",
					element: <div>User Profile</div>,
				},
				{
					path: "/logout",
					element: <Logout />,
				},
			],
		},
	];

	// Define routes accessible only to non-authenticated users
	const routesForNotAuthenticatedOnly: RouteObject[] = [
		{
			path: "/",
			element: <div>Home Page</div>,
		},
		{
			path: "/login",
			element: <Login />,
		},
	];

	// Combine and conditionally include routes based on authentication status
	const router = createBrowserRouter([
		...routesForPublic,
		...(!accessToken ? routesForNotAuthenticatedOnly : []),
		...routesForAuthenticatedOnly,
	]);

	// Provide the router configuration using RouterProvider
	return <RouterProvider router={router} />;
};

export default Routes;