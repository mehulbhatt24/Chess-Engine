import React from "react";
import Draggable, {DraggableCore} from 'react-draggable'; 
import "../../styles/Square.css";
export default function(props){
    
    let class_ = props._color + " square" + (props.highlight?" highlight":"");
    
    return(
        <div className = {class_} id={props.id.toString()}>{props.image?<div className="image">{props.image}</div>:null}</div>
    )
    
}