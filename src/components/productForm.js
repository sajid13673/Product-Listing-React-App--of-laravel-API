import React from "react";

export default function ProductForm(props){
    const [formData, setFormData] = React.useState({
        sku:"",
        name:"",
        price:"",
        imageFile:"",
        status:false
    });
    function handleChange(event){
        const value = event.target.value;
        const checked = event.target.checked;
        const type = event.target.type;
        setFormData(prevFormData=>{return{...prevFormData, [event.target.name] : type ==='checkbox' ? checked : value}})
    }
    function handleSubmit(event){
        event.preventDefault();
        console.log(props.updateStatus)
        if(props.updateStatus){
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
    
    
    return (
      <div className="div-form">
        <form
          id="product-form"
          onSubmit={handleSubmit}
          encType="multipart/form"
        >
          <p>SKU:</p>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
          <p>Name:</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <p>Price:</p>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
          <p>Image:</p>
          <input
            type="file"
            className="file-input"
            name="imageFile"
            onChange={handleImage}
          />
          <p>Status:</p>
          <label className="toggle">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
            <span className="slider"></span>
            <span
              className="labels"
              data-on="Active"
              data-off="Inactive"
            ></span>
          </label>
        </form>
      </div>
    );
}