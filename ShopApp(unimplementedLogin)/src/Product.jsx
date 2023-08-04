import React from "react";

function Product(props){
    return (
        <div style={{border: "2px solid black", width: "25vw"}}>
            <h2>{props.name}</h2>
            <p>{props.price}</p>
        </div>
    );
}

export default Product;