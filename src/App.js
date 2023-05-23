import React, { useEffect } from "react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ProductList from "./components/productList";
import AddProduct from "./components/addProduct";
import EditProduct from "./components/editProduct";
import { Route, Routes } from "react-router-dom";
import {data} from './components/data';
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        image={item.image}
        status={item.status}
        handleEdit={() => handleEdit(item.id)}
        handleDelete = {()=>handleDelete(item.id)}
        handleStatus = {()=>handleStatus(item.id, item.status)}
      />
    );
  });

  function getProducts(){
     axios.get('http://127.0.0.1:8000/api/item').then(function(response){
      setProductStatus(true);
      setProducts(response.data);
      console.log("get prod ");
  });
  }
  const  [navStatus, setNavStatus] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  function handleEdit(id){
    navigate('edit-product',{state:{id : id}})
}
function handleDelete(id){
  axios.post('http://127.0.0.1:8000/api/item/'+id,{_method: 'delete'})
  .then(()=>{
  getProducts();})
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

            />
          }
        />
        <Route
          path="/"
          element={<div className='products'>
            {productStatus &&  prooductList}
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}