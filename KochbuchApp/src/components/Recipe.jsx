import React from "react";
import { getIngredients } from "../database/functions";

function Recipe({ recipe }){
    const [ingredients, setIngredients] = React.useState([]);
    const [display, setDisplay] = React.useState(true);

    React.useEffect(() => {
        getIngredients(recipe['rezept_id']).then(res => {
            setIngredients(res);
        });
    });

    function switchDisplay(){
        setDisplay(!display);
    }
    
    return (
        <div style={{width: "10vw", height: "25vh"}}>
            <h2 onClick={switchDisplay} style={{userSelect: "none"}}>{recipe['bezeichnung']}</h2>
            <ul>
            {ingredients.map(function(ingredient){
                return display ? (
                    <li>{ingredient['menge']} {ingredient['bezeichnung']}</li>
                ) 
                : null;
            })}
            </ul>
        </div>
    );
}

export default Recipe;