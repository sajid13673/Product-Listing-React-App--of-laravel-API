import React, { useEffect } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ProductList from "./components/productList";
import AddProduct from "./components/addProduct";
import EditProduct from "./components/editProduct";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "./firebase";
import {ref, deleteObject} from "firebase/storage";

export default function App() {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState([]);
  const [productStatus, setProductStatus] = React.useState(false);
  const prooductList = products.map((item) => {
    return (
      <ProductList
        key={item.id}
        name={item.name}
        sku={item.sku}
        price={item.price}
        image={item.images}
        status={item.status}
        handleEdit={() => handleEdit(item.id)}
        handleDelete = {()=>handleDelete(item.id, item.images)}
        handleStatus = {()=>handleStatus(item.id, item.status)}
      />
    );
  });
  const emptyList = <div className="emptyList"> <h1>Product List is empty</h1> </div>;
  const sort = <select className='sortSelect' onChange={handleChangeSort}>
    <option selected disabled>Sort by:</option>
    <option value='sku,asc'>SKU Ascending</option>
    <option value='sku,desc'>SKU Descending</option>
    <option value='name,asc'>Name Ascending</option>
    <option value='name,desc'>Name Descending</option>
    <option value='price,asc'>Price Low to High</option>
    <option value='price,desc'>Price High to Low</option>
    <option value='created_at,asc'>Oldest to Newest</option>
    <option value='created_at,desc'>Newest to Oldest</option>
  </select>
  function handleChangeSort(event){
    const value = event.target.value;
    const valArr = value.split(",");
    const data = {key: valArr[0], order: valArr[1]};
    axios.post('http://127.0.0.1:8000/api/item/sort',data).then((response)=>{
      console.log(response.data);
      setProducts(response.data)

    })
  }
  function getProducts(){
     axios.get('http://127.0.0.1:8000/api/item').then(function(response){
      setProducts(response.data);
      if(response.data.length != 0){
        setProductStatus(true);
      }
      console.log("get",response.data);
  });
  }
  const  [navStatus, setNavStatus] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  function handleEdit(id){
    navigate('edit-product',{state:{id : id}})
}
function handleDelete(id, image) {
  axios
    .post("http://127.0.0.1:8000/api/item/" + id, { _method: "delete" })
    .then(() => {
      if (image !== null) {
        const imageName = image.imageName;
        deleteFromFireBase(imageName);
      }
      getProducts();
    });
}
function deleteFromFireBase(imageName){
  if(imageName != null){
  const desertRef = ref(storage, `images/${imageName}`);
      deleteObject(desertRef);}
}
function handleStatus(id, status){
const data = new FormData();
data.append('status', !status);
data.append('_method', 'put');
axios.post(`http://127.0.0.1:8000/api/item/${id}`, data)
.then(()=>{
 console.log("changed");
 getProducts(); 
})
}

  useEffect(()=>{
     getProducts();
  },[]);
  useEffect(()=>{
    console.log('renderred');
  },[products])

  return (
    <div className="app">
      <Navbar navStatus={navStatus}
              updateStatus={update}
              setUpdate={(status) => setUpdate(status)}
              setNavStatus = {(status)=>setNavStatus(status)}

              />
      <Routes>
        <Route
          path="add-product"
          element={<AddProduct updateStatus={update}
          getProducts = {()=>getProducts()}
          setNavStatus = {(status)=>setNavStatus(status)}
          />}
        />
        <Route
          path="edit-product"
          element={
            <EditProduct
              setUpdate={(status) => setUpdate(status)}
              updateStatus={update}
              setNavStatus = {(status)=>setNavStatus(status)}
              getProducts = {()=>getProducts()}
              deleteFromFireBase = {(imageName)=>deleteFromFireBase(imageName)}
            />
          }
        />
        <Route
          path="/"
          element={<div className='product_list'>
          {productStatus && sort}
            <div className='products'>
          {productStatus ?  prooductList : emptyList}
          </div>
          </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}