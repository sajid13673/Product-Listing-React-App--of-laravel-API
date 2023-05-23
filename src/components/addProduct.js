import React from 'react';
import ProductForm from './productForm';
import axios from 'axios';
import {storage} from './../firebase';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {useNavigate} from 'react-router-dom';


export default function AddProduct(props){
    const navigate = useNavigate();
    function handleAdd(event, formData){
        event.preventDefault();

 
    if (formData.image == "") {
      console.log("no images :", formData);
      axios
        .post("http://127.0.0.1:8000/api/item/validate", formData)
        .then(function (response) {
          //console.log(response.data.message);
          console.log(response.data);
          const $message = response.data.message;
          const $status = response.data.status;
          if ($status) {
            axios.post("http://127.0.0.1:8000/api/item", formData);
            props.getProducts();
            navigate("/");
            props.setNavStatus(false);
          } else {
            alert($message);
          }
        });
    } else {
      // const imageRef = ref(storage, `images/${formData.image.name}_${formData.sku}`);
      // uploadBytes(imageRef, formData.image)
      // .then((snapshot)=>{
      //     getDownloadURL(snapshot.ref).then((url)=>{
      //         formData.image = url;
      //         console.log(formData);
      //         axios.post('http://127.0.0.1:8000/api/item',formData).then(function(response){
      //         navigate('/')
      //         props.getProducts();

      //         });
      //     })
      // })
      const form = new FormData();
      Object.keys(formData).map((key) => form.append(key, formData[key]));
      console.log("upd :", form);
      axios
        .post("http://127.0.0.1:8000/api/item/validate", form)
        .then(function (response) {
          console.log(response.data);
          const $message = response.data.message;
          const $status = response.data.status;
          if ($status) {
            const imageRef = ref(
              storage,
              `images/${formData.image.name}_${formData.sku}`
            );
            uploadBytes(imageRef, formData.image).then((snapshot) => {
              getDownloadURL(snapshot.ref).then((url) => {
                //formData.image = url;
                form.set("image", url);
                axios
                  .post("http://127.0.0.1:8000/api/item", form)
                  .then(function (response) {
                    navigate("/");
                    props.getProducts();
                  });
              });
            });
          } else {
            alert($message);
          }
        });
    }
    }
    React.useEffect(()=>{
        props.setNavStatus(true)
    },[])
    return(
        <ProductForm 
        handleAdd = {(event, FormData)=>handleAdd(event, FormData)}
        updateStatus = {props.updateStatus}
        />
    )
}