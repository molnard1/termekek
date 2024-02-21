import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

export default function SinglePizzaPage() {
    const data = useSelector((state) => state.data).products;
    const [item, setItem] = useState({
        name: "",
        price: 0
    });
    const [navigateAway, setNavigateAway] = useState(false);

    useEffect(() => {
        let item = data.find((item) => item.id == window.location.pathname.split("/")[1]);

        if (!item) {
            setNavigateAway(true);
        }

        setItem(item);
    }, []);

    return (
        <div>
            {navigateAway ? <Navigate to="/" replace={true} /> : <div className="text-center mt-5">
                <h1>{item.name}</h1>
                Ár: {item.price}<br />
            </div>}
        </div>
    )
}