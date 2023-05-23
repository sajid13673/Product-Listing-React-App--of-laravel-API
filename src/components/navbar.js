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
    return(
        <nav>
            <ul className="nav-items">
                <li className="nav-header">Product Add</li>
                    <li><button className="btn-cancel" onClick={handleCancel} style={{ display: props.navStatus ? 'block' : 'none' }}>Cancel</button></li>
                    <li><button className="btn-save" style={{ display: props.navStatus ? 'block' : 'none' }} form="product-form">{props.updateStatus ? "Update" : "Save"}</button></li>
                    <li><button className="btn-add" style={{ display: props.navStatus ? 'none' : 'block' }} onClick={handleAdd}>Add Product</button></li>>
                    {/* <li><button className="btn-save" >Mass Delete</button></li> */}

            </ul>
        </nav>
    )
}