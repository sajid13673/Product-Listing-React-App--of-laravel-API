import React from "react";
import {useNavigate} from 'react-router-dom';

export default function Navbar(props){
    const navigate = useNavigate();
    function handleAdd(){
        navigate('add-product')
    }
    function handleCancel(){
        props.setUpdate(false);
        navigate('/');
        props.setNavStatus(false);
    }
    const [title, setTitle] = React.useState("");
    React.useEffect(()=>{
        if(!props.navStatus){
            setTitle("Product List")
        }
        else if(props.navStatus && !props.updateStatus){
            setTitle("Add Product")
        }
        else if(props.navStatus && props.updateStatus){
            setTitle("Edit Product")
        }
    },[props.navStatus, props.updateStatus])

    return(
        <nav>
            <ul className="nav-items">
                <li className="nav-header">{title}</li>
                    <li><button className="btn-cancel" onClick={handleCancel} style={{ display: props.navStatus ? 'block' : 'none' }}>Cancel <i class="fa-solid fa-xmark fa-xl"></i></button></li>
                    <li><button className="btn-save" style={{ display: props.navStatus ? 'block' : 'none' }} form="product-form">{props.updateStatus ? "Update " : "Save "}<i className={props.updateStatus ? "fa-solid fa-file-pen fa-lg" : "fa-solid fa-floppy-disk fa-lg"}></i></button></li>
                    <li><button className="btn-add" style={{ display: props.navStatus ? 'none' : 'block' }} onClick={handleAdd}>Add Product <i class="fa-solid fa-plus fa-xl"></i></button></li>
            </ul>
        </nav>
    )
}