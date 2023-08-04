import React from "react";
import Form from "./Form";
import Product from "./Product";

import * as functions from "./functions";

// login system noch nicht implementiert
function App(){
    const [products, setProducts] = React.useState([]);
    const [wildcard, setWildcard] = React.useState("");

    async function updateProducts(){
        if(wildcard === ""){
            setProducts(await functions.getAllProducts());
        }
        else{
            setProducts(await functions.getProduct(wildcard))
        }
    }

    React.useEffect(() => {
        updateProducts();
    }, 
    [wildcard]);

    return (   
        <div>
            <Form setWildcard={setWildcard}/>

            {
                products.map(product => {
                    return <Product 
                        name={product.product_name}
                        price={product.price}
                        key={product.product_id} 
                    />
                })
            }
        </div>
    );
}

export default App;