import React from "react";

function Form({changeWildcard}){
    return (
        <div>
            <input type="text" onChange={changeWildcard}/>
        </div>
    );
}

export default Form;