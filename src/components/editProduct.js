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

    function handleUpdate(event, formData) {
      event.preventDefault();
      const form = new FormData();
      Object.keys(formData).map((key) => form.append(key, formData[key]));
      form.append("id", id);
      if (formData.imageFile == "") {
        axios
          .post("http://127.0.0.1:8000/api/item/editValidation", form)
          .then((response) => {
            console.log(response.data);
            const message = response.data.message;
            const status = response.data.status;
            if (status) {
              form.append("_method", "put");
              axios.post(`http://127.0.0.1:8000/api/item/${id}`, form);
              props.getProducts();
              navigate("/");
              props.setUpdate(false);
              props.setNavStatus(false);
            } else {
              alert(message);
            }
          });
      } else {
        axios
          .post("http://127.0.0.1:8000/api/item/editValidation", form)
          .then(function (response) {
            console.log(response.data);
            const $message = response.data.message;
            const $status = response.data.status;
            const imageName = `${formData.sku}_${formData.imageFile.name}`;
            if ($status) {
              const imageRef = ref(storage, `images/${imageName}`);
              uploadBytes(imageRef, formData.imageFile).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                  form.append("_method", "put");
                  form.append("imageLink", url);
                  form.append("imageName", imageName);
                  form.delete("id");
                  axios.post(`http://127.0.0.1:8000/api/item/${id}`, form);
                  console.log(productWithID)
                  if (productWithID.images !== null){
                  props.deleteFromFireBase(productWithID.images.imageName);
                }
                  props.setNavStatus(false);
                  props.setUpdate(false);
                  navigate("/");
                  props.getProducts();
                });
              });
            } else {
              alert($message);
            }
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