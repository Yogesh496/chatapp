import { useContext } from "react";
import { InfoContext } from "../../../context/InfoContext.jsx";

function Child3({name}){
    const {info} = useContext(InfoContext)
    return <>
    <div>
    chidl3 {name} {info?.details} {info?.role}
    </div>
    </>
}

export default Child3;