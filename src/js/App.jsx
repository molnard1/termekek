import React, { useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPizzaPage from "./components/ListPizzaPage";
import NavbarComponent from "./components/NavbarComponent";
import store, { actions } from "./store";
import { Provider, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import LoginPage from "./components/LoginPage";
import SinglePizzaPage from "./components/SinglePizzaPage";
import { AuthenticatedRoute } from "./components/AuthenticatedRoute";
import axios from "axios";

const router = createBrowserRouter([
    {
        path: "/",
        element: <NavbarComponent />,
		children: [
			{
				path: "/",
				element: <AuthenticatedRoute><ListPizzaPage /></AuthenticatedRoute>,
			},
			{
				path: "/:id",
				element: <AuthenticatedRoute><SinglePizzaPage /></AuthenticatedRoute>,
			},
			{
				path: "/login",
				element: <LoginPage />
			},
			{
				path: "*",
				element: <AuthenticatedRoute><ListPizzaPage /></AuthenticatedRoute>
			}
		]
    }
]);

export const API_URL = "https://jwt.sulla.hu";

export async function fetchEndpoint(endpoint) {
    var request = await doRequest(endpoint);
    if(!request.success && request.code === 401) {
        var resp = await refreshToken();
        if(resp && resp.status == 200) {
            var token = (await resp.json()).message;
            store.dispatch(actions.setAccessToken(token));
            return fetchEndpoint(endpoint);
        }else{
            return {
                data: null
            }
        }
    }else{
        return request;
    }
}

async function doRequest(endpoint) {
    let resp;
    try {
        resp = await axios.get(`${API_URL}/${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${store.getState().auth.accessToken}`
            }
        });
    }catch (error) {
        return {
            success: false,
            code: error.response.status,
            data: error.response.data
        };
    }

    return {
        success: true,
        code: resp.status,
        data: resp.data
    }
}

export async function fetchProfile() {   
    const profileResponse = (await fetchEndpoint("termekek")).data;
    if (profileResponse == null) {
        return false;
    }

    store.dispatch(actions.setProducts(profileResponse));

    return true;
}

export default function App() {
	const [loaded, setLoaded] = useState(false);
	const loggedIn = useSelector(state => state.auth).accessToken != null;

	useEffect(() => {
		if (loggedIn) {
			fetchProfile().then(() => {
				setLoaded(true);
			});
		} else {
			// No point in trying to load session data if we don't have a session token.
			// We'll just do it when the user logs in instead.
			setLoaded(true);
		}
	}, []);

	if (!loaded) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Spinner animation="border" role="status" />
				<h1>Töltés...</h1>
			</div>
		)
	}

	return (
		<RouterProvider router={router} />
	)
}

createRoot(document.getElementById("root")).render(<Provider store={store}><App /></Provider>);