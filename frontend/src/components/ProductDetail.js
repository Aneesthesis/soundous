import { Rating } from "./Rating"

export const ProductDetails = ({product})=>{
return(
    <div className="product-detail my-5 mx-10 flex gap-x-10">
        <div className="image w-[35%]"><img src={product.image} alt={product.name}/></div>
        <div className="product-info flex flex-col gap-y-1 w-fit"><div className="font-bold text-2xl">{product.name}</div>
        <Rating rating={product.rating} numReviews={product.numReviews}/>
        <div>Price: {product.price}</div>
        <div>Description: {product.description}</div>
        <div>Status: {product.countInStock? <span className="bg-green-500 w-fit px-2 py-1 text-white rounded-md">Available</span>:<span className="bg-gray-500 w-fit px-2 py-1 text-white rounded-md">Out of Stock</span>}</div>
        <div className="w-fit px-4 py-1 bg-yellow-400 font-semibold my-4 cursor-pointer">Add to Cart</div>
        </div>
    </div>
)
}