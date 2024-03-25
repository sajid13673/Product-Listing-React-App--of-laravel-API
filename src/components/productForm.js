import React from "react";
import { isInteger, useFormik } from "formik";
import axios from "axios";

export default function ProductForm(props){
  function countDecimals (value) {
    if(Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0; 
    }
  const validate = values => {
    const errors = {};
    if (!values.sku) {
      errors.sku = 'Required';
    } else if (values.sku.length > 20) {
      errors.sku = 'Must be 20 characters or less';
    }
    if (!values.name) {
      errors.name = 'Required';
    } else if (values.name.length > 50) {
      errors.name = 'Must be 20 characters or less';
    }
  
    if (!values.price) {
      errors.price = 'Required';
    } else if (isNaN(values.price)) {
      errors.price = 'Please enter a valid price';
    } else if(!isNaN(values.price)){
      if(!isInteger(values.price)){
        if(countDecimals(values.price) > 2){
          errors.price = 'Please enter a valid price';
        }
    }
    }
    if (values.imageFile) {
      console.log(values.imageFile.type);
      var tSet = new Set(["image/png", "image/jpeg", "image/jpg"])
      let imageType = values.imageFile.type;
      if ( !tSet.has(imageType) ){
        errors.imageFile = "Please upload a valid image";
      }
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      sku: "",
      name: "",
      price: "",
      imageFile: "",
      status: 0,
    },
    validate: validate,
    onSubmit: (values) => {
      console.log(values);
      if (props.updateStatus) {
        console.log("edit Status");
        props.handleUpdate(values);
      } else {
        axios
          .post("http://127.0.0.1:8000/api/item/checkSku", {
            sku: values.sku,
          })
          .then((res) => {
            console.log(res.data.duplicate);
            if (res.data.duplicate) {
              formik.setErrors({ sku: "Sku already exists" });
            } else {
              props.handleAdd(values);
            }
          });
      }
    },
  });

  function handleChange(event){
      const checked = event.target.checked ? 1 : 0;
      console.log(checked);
      formik.setFieldValue('status', checked);
  }
  function handleImage(event){
    var file = event.target.files[0];
    formik.setFieldValue('imageFile', file);
      console.log("filechanged");
  }
  React.useEffect(() => {
    if (props.updateStatus && props.data !== undefined) {
      const data = props.data;
      formik.setValues({
        ...formik.values,
        name: data.name,
        sku: data.sku,
        price: data.price,
        status: data.status
    })
    }
  }, [props.data]);
  
  
  return (
    <div className="div-form">
      <form
        id="product-form"
        onSubmit={formik.handleSubmit}
        encType="multipart/form"
      >
        <p>SKU:</p>
        {formik.errors.sku ? <div className="error">{formik.errors.sku}</div> : null}
        <input
          type="text"
          name="sku"
          value={formik.values.sku}
          onChange={formik.handleChange}
        />
        <p>Name:</p>
        {formik.errors.name ? <div className="error">{formik.errors.name}</div> : null}
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <p>Price:</p>
        {formik.errors.price ? <div className="error">{formik.errors.price}</div> : null}
        <input
          type="text"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
        />
        <p>Image:</p>
        {formik.errors.imageFile ? <div className="error">{formik.errors.imageFile}</div> : null}
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
            checked={formik.values.status}
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