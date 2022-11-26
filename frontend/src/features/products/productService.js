import axios from 'axios'

const API_URL='/api/products'

//retrieve products
const getProducts=async () =>{
  const response=await axios.get(API_URL)

  if(response.data){
    localStorage.setItem('products',JSON.stringify(response.data))
  }

  return response.data
}

const productService={
  getProducts
}
export default productService