import React from "react";

function Form(props){
    return (
        <div>
            <input type="text" onChange={e => {
                props.setWildcard(e.target.value)
            }} />
        </div>
    );
}

export default Form;