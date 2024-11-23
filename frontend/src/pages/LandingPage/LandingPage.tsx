import React from "react";
import "./LandingPage.css";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LandingPage: React.FC = () => {
    return(
        <div id="landing-container">
            <h1 id="landing-heading">Invoice Manager</h1>
            <FontAwesomeIcon icon={faCoins} />
        </div>
    )
};

export default LandingPage;