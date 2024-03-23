import React, { useEffect } from 'react';
import ProductForm from './productForm';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import {storage} from './../firebase';
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";


export default function EditProduct(props){
    const location = useLocation();
    const [productWithID, setProductWithID] = React.useState([]);
    const id = location.state.id;
    const navigate = useNavigate()

    React.useEffect(() => {
      axios
        .get(`http://127.0.0.1:8000/api/item/${id}`)
        .then(function (response) {
          setProductWithID(response.data);
        });
      props.setUpdate(true);
      props.setNavStatus(true);
    }, []);

    function handleUpdate(formData) {
      const form = new FormData();
      Object.keys(formData).map((key) => form.append(key, formData[key]));
      form.append("id", id);
      if (formData.imageFile == "") {
              form.append("_method", "put");
              axios.post(`http://127.0.0.1:8000/api/item/${id}`, form).then(res =>{
                console.log(res.data);
                props.getProducts();
                navigate("/");
                props.setUpdate(false);
                props.setNavStatus(false);
              }).catch(err => {
                console.log(err.response.data.message);
              });
      } else {
            const imageName = `${formData.sku}_${formData.imageFile.name}`;
              const imageRef = ref(storage, `images/${imageName}`);
              uploadBytes(imageRef, formData.imageFile).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  form.append("_method", "put");
                  form.append("imageLink", url);
                  form.append("imageName", imageName);
                  form.delete("id");
                  axios.post(`http://127.0.0.1:8000/api/item/${id}`, form).then(res =>{
                    console.log(res.data);
                    if (productWithID.images !== null){
                      props.deleteFromFireBase(productWithID.images.imageName);
                    }
                      props.setNavStatus(false);
                      props.setUpdate(false);
                      navigate("/");
                      props.getProducts();
                  }).catch(err => {
                    console.log(err.response.data.message);
                  });
                  console.log(productWithID)
                  
                });
              });
      }
    }
    return(
        <ProductForm
        handleUpdate = {(event, formData)=>handleUpdate(event, formData)}
        updateStatus = {props.updateStatus}
        data = {productWithID}
        />
    )
}