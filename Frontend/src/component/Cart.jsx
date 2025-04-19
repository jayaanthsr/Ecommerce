import axios from "axios";
import {useEffect, useState} from "react";
import './styles/Cart.css'

function Cart() {
    const username = localStorage.getItem("userName");
    const [userCart,setUserCart]=useState([])

    useEffect(()=> {
        DispalyCart();
    })

    function DispalyCart(){
        axios.post(`http://localhost:8080/cart/${username}`)
            .then(res => {
                setUserCart(res.data);
                console.log(res.data);
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="cart-container">
        <p>welcome to cart</p>
            <table className="cart-table">
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {userCart.map((item) => (
                    <tr>
                        <td>{item.productName}</td>
                        <td>{item.productPrice}</td>
                    </tr>

                ))}
                </tbody>
            </table>
        </div>
    )
}
export default Cart;