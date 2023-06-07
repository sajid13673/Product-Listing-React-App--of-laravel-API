import React from "react";

export default function ProductList(props){
    const defaultImage = 'https://firebasestorage.googleapis.com/v0/b/laravel-product-list-frontend.appspot.com/o/images%2Fno%20image.jpg?alt=media&token=cfaed1bd-c1f4-4566-8dca-25b05e101829';
    const [statusHover, setStatusHover] = React.useState(false);
    const [statusStyle, setStatusStyle] = React.useState();
    const [status, setStatus] = React.useState();
    const [statusIcon, setStatusIcon] = React.useState(); 
    function handleMouseover(){
        setStatusHover(true);
    }
    function handleMouseOut(){
        setStatusHover(false);
    }
    React.useEffect(()=>{
        if(statusHover){
            if (props.status){
                setStatus('Inactivate');
                setStatusStyle({background : '#02325a',color:  'rgb(255, 20, 20)', border: 'solid 2px rgb(255, 20, 20)', boxShadow: '0 0.5em 0.5em -0.4em rgb(255, 72, 72)', width: '120px'});
                setStatusIcon("fa-solid fa-thumbs-down");
            }
                else if (!props.status){
                    setStatus('Activate');   
                    setStatusIcon("fa-solid fa-thumbs-up");
                    setStatusStyle({background : '#02325a', color: 'rgb(1, 255, 77)', border: 'solid rgb(1, 255, 77) 2px'});
                }
        }
        else if(!statusHover){
            if (props.status){
            setStatus('Active');
            setStatusStyle({background : 'green'});
            setStatusIcon("fa-solid fa-thumbs-up");
        }
            else if (!props.status){
                setStatus('Inactive');
                setStatusStyle({background : 'red'});
                setStatusIcon("fa-solid fa-thumbs-down");
            }
        }
    },[statusHover, props.status])
    return(
        <div className='ProductDetails'>
            <img className='productImage' src={props.image !== null ? props.image.imageLink : defaultImage} alt='productImage'/>
            <p>SKU: {props.sku}</p>
            <p>Name: {props.name}</p>
            <p>Price: $ {props.price}</p>
            <div className='product-buttons'>
            <button className="statusBar" onMouseOver={handleMouseover} onMouseOut={handleMouseOut} style={statusStyle} onClick={props.handleStatus}>{status}  <i className={statusIcon}></i></button>
            <button className='btn-edit' onClick={props.handleEdit}> <i class="fa-solid fa-pen-to-square fa-xl"></i> </button>
            <button className='btn-delete'  onClick={props.handleDelete}><i class="fa-solid fa-trash-can fa-lg"></i></button>
            </div>
        </div>
    )
}