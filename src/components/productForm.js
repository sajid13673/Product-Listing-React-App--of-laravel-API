import React from "react";

export default function ProductForm(props){
    const [formData, setFormData] = React.useState({
        sku:"",
        name:"",
        price:"",
        image:"",
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
            image: data.image
          };
        });
      }
    }, [props.data]);
    return(
        <div className="add_form">
            <form id="product-form" onSubmit={handleSubmit} encType="multipart/form">
                SKU:
                <br/>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange}/>
                <br/>
                Name:
                <br/>
                <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                <br/>
                Price:
                <br/>
                <input type="text" name="price" value={formData.price} onChange={handleChange}/>
                Image:
                <input type="file" name="image" onChange={handleImage}/>
            </form>
            {/* <button onClick={uploadImage}>Upload image</button> */}

        </div>
    )
}