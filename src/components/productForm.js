import React from "react";

export default function ProductForm(props){
    const [formData, setFormData] = React.useState({
        sku:"",
        name:"",
        price:"",
        imageFile:"",
    });
    function handleChange(event){
        //console.log(event.target.name);
        setFormData(prevFormData=>{return{...prevFormData, [event.target.name]:event.target.value}})
    }
    function handleSubmit(event){
        event.preventDefault();
        console.log(props.updateStatus)
        if(props.updateStatus){
            //console.log(formData);
            props.handleUpdate(event, formData);
        }
        else{
            props.handleAdd(event, formData);
        }
    }
    function handleImage(event){
        setFormData(prevFormData=>{return{...prevFormData,[event.target.name]:event.target.files[0]}})
        console.log("filechanged");
    }
    React.useEffect(() => {
      if (props.updateStatus && props.data !== undefined) {
        const data = props.data;
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            name: data.name,
            sku: data.sku,
            price: data.price,
          };
        });
      }
    }, [props.data]);
    return(
        <div className="div-form">
            <form id="product-form" onSubmit={handleSubmit} encType="multipart/form">
                <p>SKU:</p>
                {/* <br/> */}
                <input type="text" name="sku" value={formData.sku} onChange={handleChange}/>
                {/* <br/> */}
                <p>Name:</p>
                {/* <br/> */}
                <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                {/* <br/> */}
                <p>Price:</p>
                {/* <br/> */}
                <input type="text" name="price" value={formData.price} onChange={handleChange}/>
                {/* <br/> */}
                <p>Image:</p>
                {/* <br/> */}
                <input type="file" className='file-input' name="imageFile" onChange={handleImage}/>
            </form>
        </div>
    )
}