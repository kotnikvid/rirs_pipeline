import React, { useEffect, useState } from "react";
import "./Footer.css";

const Footer: React.FC = () => {
    const [year, setYear] = useState(2024);

    useEffect(() => {
        const date = new Date();
        setYear(date.getFullYear())
    }, []);

    return(
        <footer>&copy; {year} RIRS Skupina 6</footer>
    )
}

export default Footer;