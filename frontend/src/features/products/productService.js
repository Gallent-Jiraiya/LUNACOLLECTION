import axios from 'axios'

const API_URL='/api/products'

const listProduct=async(id)=>{
  const response=await axios.get(`/api/products/${id}`)
  console.log(response.data);
  if(response.data){
    //localStorage.setItem('product',JSON.stringify(response.data))
  }
  return response.data
}

//retrieve products
const getProducts=async () =>{
  const response=await axios.get(API_URL)

  if(response.data){
    localStorage.setItem('products',JSON.stringify(response.data))
  }

  return response.data
}

const productService={
  getProducts,
  listProduct,
}
export default productService