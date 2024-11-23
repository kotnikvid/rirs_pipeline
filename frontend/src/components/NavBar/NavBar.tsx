import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import {SignedIn, SignedOut, SignOutButton} from "@clerk/clerk-react";

const NavBar: React.FC = () => {
	return (
		<nav>
			<div>
				<Link className="nav-button" to="/">
					<FontAwesomeIcon icon={faHome} />
				</Link>
			</div>
			<div>
				<SignedOut>
					<Link className="nav-button" to="/auth">
						<Button variant="light" size="sm">Sign in</Button>
					</Link>
				</SignedOut>
				<SignedIn>
					<Link className="nav-button" to="/invoices">
						Invoices
					</Link>
					<SignOutButton>
						<Button variant="light" size="sm">
							Sign out
						</Button>
					</SignOutButton>
				</SignedIn>
			</div>
		</nav>
	);
};

export default NavBar;
