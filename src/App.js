import React, {useState, useEffect} from 'react'
import {commerce} from './lib/commerce'
import { Products, Cart, Checkout, NavbarHome, Home, Events, About, Footer} from './components';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'


const App = () =>{
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const fetchProducts = async () => {
        const {data} = await commerce.products.list()

        setProducts(data)
    }

    const fetchCart = async () =>{
        setCart(await commerce.cart.retrieve())

    }
//add items to cart
    const handleAddToCart = async (productId, quantity) =>{
        const {cart} = await commerce.cart.add(productId, quantity)

        setCart(cart)
    }
//update quantity of items in cart
    const handleUpdateCartQty = async (productId, quantity)=>{
        const {cart} = await commerce.cart.update(productId, {quantity})

        setCart(cart)
    }
//remove item from cart
    const handleRemoveFromCart = async(productId) =>{
        const {cart} = await commerce.cart.remove(productId)

        setCart(cart)
    }
//empty cart
    const handleEmptyCart = async ()=>{
        const {cart} = await commerce.cart.empty()

        setCart(cart)
    }

    const refreshCart = async () =>{
        const newCart = await commerce.cart.refresh()
        setCart(newCart) 
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) =>{
        try{
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)

            setOrder(incomingOrder)
            refreshCart()

        } catch(error){
            setErrorMessage(error.data.error.message)
        }
    }

    useEffect( ()=>{
        fetchProducts()
        fetchCart()
    }, [])


    return (
        <Router>
            <div>
            <NavbarHome totalItems={cart.total_items} />
               <Switch>
                    <Route exact path="/" >
                        <Home />
                    </Route>
                    <Route exact path="/about" >
                        <About />
                    </Route>
                    <Route exact path="/events">
                        <Events />
                    </Route>
                 {/* ecommerce */}
                    <Route exact path="/merch">
                        <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty/>
                    </Route>
                    <Route exact path="/cart">
                        <Cart 
                         cart={cart}
                         onUpdateCartQty = {handleUpdateCartQty}
                         onRemoveFromCart = {handleRemoveFromCart}
                         onEmptyCart = {handleEmptyCart}
                         />
                    </Route> 
                    <Route exact path='/checkout'>
                        <Checkout 
                        cart={cart} 
                        order={order}
                        onCaptureCheckout={handleCaptureCheckout}
                        error={errorMessage}
                        />
                    </Route>
               </Switch>
               <Footer/>
            </div>

        </Router>
       
    )
}
export default App;
