import React from "react";

export default function ProductList(props){
    //const [status, setStatus] = React.useState(props.status)
    // function handleChange(){
    //     //setStatus(!status);
    //     //console.log(status)
    //     props.handleStatus(props.id)
    // }
    // React.useEffect(()=>{
    //     console.log('status changed')
    // },[status])
    const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/laravel-product-list-frontend.appspot.com/o/images%2Fno%20image.jpg?alt=media&token=b38e2d03-0460-49a9-97e1-55711a8494cf';
    return(
        <div className='ProductDetails'>
            <p>SKU: {props.sku}</p>
            <p>Name: {props.name}</p>
            <p>Price: $ {props.price}</p>
            <img src={props.image !== null ? props.image : defaultImage} alt='productImage'/>
            <div className='product-buttons'>
            <button className='btn-edit' onClick={props.handleEdit}>Edit</button>
            <button className='btn-delete'  onClick={props.handleDelete}>Delete</button>
            <a className="statusBar" href='javascript:void(0)' style={{ background: props.status ? 'green' : 'red'}} onClick={props.handleStatus}>{props.status ? "Active" : "Inactive"}</a>
            </div>
        </div>
    )
}