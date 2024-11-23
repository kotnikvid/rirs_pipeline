import React, { ReactNode } from "react";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";

interface MainLayoutProps {
	children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<>
			<NavBar />
			<main>{children}</main>
			<Footer />
		</>
	);
};

export default MainLayout;
