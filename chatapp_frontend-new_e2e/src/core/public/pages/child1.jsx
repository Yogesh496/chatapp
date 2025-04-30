import { useContext } from "react";
import Child2 from "./child2";
import { InfoContext } from "../../../context/InfoContext";

function Child1({name}){

    const {setInfo}=useContext(InfoContext)

    return <>
    <div>
    chidl1 {name}
    <input type="text" onChange={($event)=>{
setInfo($event.target.value)
    }}/>
    </div>
    <Child2 name={name}/>
    </>
}

export default Child1;