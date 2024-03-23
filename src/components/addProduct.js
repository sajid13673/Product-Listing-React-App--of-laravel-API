import React from 'react';
import ProductForm from './productForm';
import axios from 'axios';
import {storage} from './../firebase';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {useNavigate} from 'react-router-dom';

export default function AddProduct(props){
    const navigate = useNavigate();
    function handleAdd(formData){
      console.log(formData);
      if (formData.imageFile == "") {
        console.log("no images :", formData);
              axios.post("http://127.0.0.1:8000/api/item", formData).then((res)=>{
                if(res.data.status){
                  navigate("/");
                  props.getProducts();
                  props.setNavStatus(false);
            }
              }).catch((err)=>{
                console.log(err.response.data.message);
              })
      } else {
        const imageName = `${formData.sku}_${formData.imageFile.name}`;
        const form = new FormData();
        Object.keys(formData).map((key) => form.append(key, formData[key]));
        console.log("upd :", form);
              const imageRef = ref(
                storage,
                `images/${imageName}`
              );
              uploadBytes(imageRef, formData.imageFile).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  //formData.image = url;
                  form.append("imageLink", url);
                  form.append("imageName", imageName);
                  axios
                    .post("http://127.0.0.1:8000/api/item", form)
                    .then(res => {
                      if(res.data.status){
                      navigate("/");
                      props.setNavStatus(false)
                      props.getProducts();
                      }
                    }).catch((err)=>{
                      console.log(err.response.data.message);
                    });
                });
              });
      }
    }
    React.useEffect(()=>{
        props.setNavStatus(true)
    },[])
    return(
      <div className='addProduct-div'>
        <ProductForm 
        handleAdd = {(event, FormData)=>handleAdd(event, FormData)}
        updateStatus = {props.updateStatus}
        />
        </div>
    )
}