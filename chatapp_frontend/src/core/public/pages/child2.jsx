import Child3 from "./child3";

function Child2({name}){
    return <>
    <div>
    chidl2 {name}
    </div>
    <Child3 name={name}/>
    </>
}

export default Child2;