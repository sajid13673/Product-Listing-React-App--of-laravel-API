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
        form.append('id',id);
        if (formData.image == productWithID.image || "") {
          console.log("no images");
          //console.log(formData);
          axios
            .post("http://127.0.0.1:8000/api/item/editValidation", form)
            .then((response) => {
              //console.log(response.data.message);
              console.log(response.data);
                const message = response.data.message;
                const status = response.data.status;
              if (status) {
                form.append('_method', 'put');
                axios.post(`http://127.0.0.1:8000/api/item/${id}`,form);
                props.getProducts();
                navigate("/");
                props.setNavStatus(false);
                //console.log("updated :", formData)
              } else {
                alert(message);
              }
            });
        } else {
          // const imageRef = ref(
          //   storage,
          //   `images/${formData.image.name}_${formData.sku}`
          // );
          // uploadBytes(imageRef, formData.image).then((snapshot) => {
          //   getDownloadURL(snapshot.ref).then((url) => {
          //     formData.image = url;
          //     console.log(formData);
          //     axios.post(`http://127.0.0.1:8000/api/item/${id}`, {
          //       _method: "put",
          //       body: formData,
          //     });
          //   });
          // });
          // console.log("image uploaded");
          axios
        .post("http://127.0.0.1:8000/api/item/editValidation", form)
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
                form.append('_method', 'put');
                form.set("image", url);
                axios
                  .post(`http://127.0.0.1:8000/api/item/${id}`, form)
                    navigate("/");
                    props.getProducts();
              });
            });
          } else {
            alert($message);
          }
        });
        }
  
      //   axios
      //     .post(`http://127.0.0.1:8000/api/item/${id}`, { _method: "put", body: formData})
      //     .then((response) => {
      //         console.log("res :",response.data);
      //       //getProducts();
      //     });
      }
  
    return(
        <ProductForm
        handleUpdate = {(event, formData)=>handleUpdate(event, formData)}
        updateStatus = {props.updateStatus}
        data = {productWithID}
        />
    )
}