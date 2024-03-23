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
import { useLocation } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const  [navStatus, setNavStatus] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [productStatus, setProductStatus] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const [sortOrder,setSortOrder] = React.useState({key: '', order:''})
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageCount, setPageCount] = React.useState(1);
  const [pages, setPages] =  React.useState([]);
  const { pathname } = useLocation();

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
  const sort = (
    <select className="sortSelect" onChange={handleChangeSort}>
      <option selected disabled>
        Sort by:
      </option>
      <option value="sku,asc">SKU Ascending</option>
      <option value="sku,desc">SKU Descending</option>
      <option value="name,asc">Name Ascending</option>
      <option value="name,desc">Name Descending</option>
      <option value="price,asc">Price Low to High</option>
      <option value="price,desc">Price High to Low</option>
      <option value="created_at,asc">Oldest to Newest</option>
      <option value="created_at,desc">Newest to Oldest</option>
    </select>
  );
  const list = pages.map((page) => {
    return(
      <li class="page-item" key={page}>
        <button class="pageBtn" onClick={()=>getPageData(page)} key={page} style={{color: page === currentPage && "white", background: page === currentPage && "#02325a"}}>{page}</button>
      </li>
    )
  });
  const pagination = (
    <div aria-label="..." id="pagination">
      <ul class="pagination">
        <li class={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <button
            class="page-link"
            onClick={() => getPageData(currentPage - 1)}
            id="prevBtn"
            style={{ color: "#02325a" }}
          >
            Previous
          </button>
        </li>
        {list}
        <li
          class={currentPage === pageCount ? "page-item disabled" : "page-item"}
        >
          <button
            class="page-link"
            onClick={() => getPageData(currentPage + 1)}
            style={{ color: "#02325a" }}
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );

  function getPageData(page){
    setCurrentPage(page);
    getProducts(page);
  };
  function handleChangeSort(event){
    const value = event.target.value;
    const valArr = value.split(",");
    setSortOrder({key: valArr[0], order: valArr[1]})
    axios.get(`http://127.0.0.1:8000/api/item?sort=${valArr[0]}&order=${valArr[1]}&per_page=8&page`).then((response)=>{
      console.log(response.data);
      setProducts(response.data.data)

    })
  };
  function getProducts(page){
      axios.get(`http://127.0.0.1:8000/api/item?sort=${sortOrder.key}&order=${sortOrder.order}&per_page=8&page=${page}`).then(function(response){
      setProducts(response.data.data);
      setPageCount(response.data.last_page)
      if(response.data.length !== 0){
        setProductStatus(true);
      }
      console.log("get",response.data);
  });
  };
  function handleEdit(id){
    navigate('edit-product',{state:{id : id}})
  };
  function handleDelete(id, image) {
    axios
      .post("http://127.0.0.1:8000/api/item/" + id, { _method: "delete" })
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          console.log(res.data.status);
          if (image !== null) {
            const imageName = image.imageName;
            deleteFromFireBase(imageName);
          }
          getProducts();
        }
        else{
          console.log(res.data.message);
        }
      }).catch(err => {
        console.log(err.response.data.message);
      });
  };
  function deleteFromFireBase(imageName){
    if(imageName != null){
      const desertRef = ref(storage, `images/${imageName}`);
      deleteObject(desertRef);}
  };
  function handleStatus(id, status){
    const data = new FormData();
    data.append('status', status ? 0 : 1);
    data.append('_method', 'put');
    axios.post(`http://127.0.0.1:8000/api/item/${id}`, data)
    .then(()=>{
      console.log("changed");
      getProducts(); 
    })
  };

  useEffect(()=>{
     getProducts();
     console.log(pages);
  },[]);
  useEffect(()=>{
    console.log('renderred');
  },[products]);
  //Create an array of page numbers
  useEffect(()=>{
    console.log("page count :"+pageCount);
    setPages(Array.from({length: pageCount}, (_, i) => i + 1))
  },[pageCount])
  // Update the navbar with the url
  useEffect(()=>{
    if(pathname === '/'){
      setNavStatus(false);
    }
    console.log(pathname);
  },[pathname]);
  return (
    <div className="app">
      <Navbar
        navStatus={navStatus}
        updateStatus={update}
        setUpdate={(status) => setUpdate(status)}
        setNavStatus={(status) => setNavStatus(status)}
      />
      <Routes>
        <Route
          path="add-product"
          element={
            <AddProduct
              updateStatus={update}
              getProducts={() => getProducts()}
              setNavStatus={(status) => setNavStatus(status)}
            />
          }
        />
        <Route
          path="edit-product"
          element={
            <EditProduct
              setUpdate={(status) => setUpdate(status)}
              updateStatus={update}
              setNavStatus={(status) => setNavStatus(status)}
              getProducts={() => getProducts()}
              deleteFromFireBase={(imageName) => deleteFromFireBase(imageName)}
            />
          }
        />
        <Route
          path="/"
          element={
            <div className="product_list">
              <div className="pageControl">
                {productStatus && pagination} {productStatus && sort}{" "}
              </div>

              <div className="products">
                {productStatus ? prooductList : emptyList}
              </div>
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}