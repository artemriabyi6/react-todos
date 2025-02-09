import { useRef } from "react";

const Input = () => {

    const inputRef = useRef(null)

    const addTodos = () => {
        
    }

    return ( 
        <>
            <input ref={inputRef} type="text" />
            <button onClick={addTodos}></button>
        </>
     );
}
 
export default Input;