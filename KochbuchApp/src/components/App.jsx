import React from "react";
import { getRecipes } from "../database/functions";

import Recipe from "./Recipe";
import Form from "./Form";

function App(){
    const [recipes, setRecipes] = React.useState([]);
    const [wildcard, setWildcard] = React.useState("");

    function changeWildcard(e){
        setWildcard(e.target.value);
    }

    React.useEffect(() => {
        getRecipes(wildcard).then(res => {
            setRecipes(res);
        });
    }, [wildcard]);

    return (
        <div>
            <Form changeWildcard={changeWildcard}/>
            <div style={{
            display: "flex", 
            flexWrap: "wrap",
            justifyContent: "space-around"
            }}>
                {recipes.map(function(recipe){
                    return(
                        <Recipe recipe={recipe}/>
                    );
                })}
            </div>
        </div>
    );
}

export default App;