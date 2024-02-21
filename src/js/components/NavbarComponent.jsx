import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { actions } from '../store';

export default function NavbarComponent() {
	const loggedIn = useSelector(state => state.auth).accessToken != null;
	const dispatch = useDispatch();

  return (
	<>
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<Link className="navbar-brand" to="/">Termékek</Link>
				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarNav">
				{!loggedIn ?
					<div className="navbar-text">
						<Link to="/login">Bejelentkezés</Link>
					</div>
				: <div>
					<a style={{ cursor: 'pointer', color: 'white' }} onClick={() => dispatch(actions.setAccessToken(null))} className="nav-link">Kijelentkezés</a>	
				</div>}
				</div>
			</div>
		</nav>
		<Outlet />
	</>
  );
};