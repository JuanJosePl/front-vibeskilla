import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "../src/contexts/AuthContext"
import { cartService } from "../src/services/cartService"

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_CART":
      return {
        ...state,
        items: action.payload.items || [],
        subtotal: action.payload.subtotal || 0,
        total: action.payload.total || 0,
        discount: action.payload.discount || 0,
        coupon: action.payload.coupon || null,
        loading: false
      }

    case "ADD_ITEM":
      const existingItem = state.items.find((item) => 
        item.product?._id === action.payload.product?._id &&
        JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
      )
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product?._id === action.payload.product?._id &&
            JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => 
          !(item.product?._id === action.payload.productId &&
          JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes))
        ),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product?._id === action.payload.productId &&
            JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
              ? { ...item, quantity: Math.max(0, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        coupon: null,
        subtotal: 0,
        total: 0,
        discount: 0
      }

    case "TOGGLE_WISHLIST":
      const isInWishlist = state.wishlist.find(item => item._id === action.payload._id)
      if (isInWishlist) {
        return {
          ...state,
          wishlist: state.wishlist.filter(item => item._id !== action.payload._id)
        }
      } else {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload]
        }
      }

    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: action.payload
      }

    case "MOVE_TO_CART":
      const wishlistItem = state.wishlist.find(item => item._id === action.payload)
      if (wishlistItem) {
        return {
          ...state,
          wishlist: state.wishlist.filter(item => item._id !== action.payload),
          items: [...state.items, { 
            product: wishlistItem,
            quantity: 1, 
            attributes: {}
          }]
        }
      }
      return state

    case "CLEAR_WISHLIST":
      return {
        ...state,
        wishlist: []
      }

    case "APPLY_COUPON":
      return {
        ...state,
        coupon: action.payload
      }

    case "REMOVE_COUPON":
      return {
        ...state,
        coupon: null
      }

    default:
      return state
  }
}

const initialState = {
  items: [],
  wishlist: [],
  coupon: null,
  subtotal: 0,
  total: 0,
  discount: 0,
  loading: false
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated, token } = useAuth()

  // Cargar carrito desde el backend cuando el usuario se autentica
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (isAuthenticated && token) {
        try {
          dispatch({ type: "SET_LOADING", payload: true })
          const response = await cartService.getCart(token)
          if (response.success) {
            dispatch({ 
              type: "SET_CART", 
              payload: response.data 
            })
          }
        } catch (error) {
          console.error("Error loading cart from backend:", error)
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
    }

    loadCartFromBackend()
  }, [isAuthenticated, token])

  // Cargar wishlist desde localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("killavibes-wishlist")
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist)
        dispatch({ type: "SET_WISHLIST", payload: parsedWishlist })
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error)
      }
    }
  }, [])

  // Guardar wishlist en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("killavibes-wishlist", JSON.stringify(state.wishlist))
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error)
    }
  }, [state.wishlist])

  const addItem = async (product, quantity = 1, attributes = {}) => {
    if (!isAuthenticated) {
      // Si no está autenticado, usar estado local
      dispatch({ 
        type: "ADD_ITEM", 
        payload: { 
          product: product,
          quantity,
          attributes,
          price: product.price
        } 
      })
      return true
    }

    try {
      const response = await cartService.addToCart({
        productId: product._id || product.id,
        quantity,
        attributes
      }, token)

      if (response.success) {
        // Recargar carrito completo desde el backend
        const cartResponse = await cartService.getCart(token)
        if (cartResponse.success) {
          dispatch({ 
            type: "SET_CART", 
            payload: cartResponse.data 
          })
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Error adding item to cart:", error)
      return false
    }
  }

  const removeItem = async (productId, attributes = {}) => {
    if (!isAuthenticated) {
      dispatch({ type: "REMOVE_ITEM", payload: { productId, attributes } })
      return
    }

    try {
      const response = await cartService.removeFromCart(productId, attributes, token)
      if (response.success) {
        const cartResponse = await cartService.getCart(token)
        if (cartResponse.success) {
          dispatch({ 
            type: "SET_CART", 
            payload: cartResponse.data 
          })
        }
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
    }
  }

  const updateQuantity = async (productId, quantity, attributes = {}) => {
    if (!isAuthenticated) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, attributes } })
      return
    }

    try {
      const response = await cartService.updateCartItem(productId, { quantity, attributes }, token)
      if (response.success) {
        const cartResponse = await cartService.getCart(token)
        if (cartResponse.success) {
          dispatch({ 
            type: "SET_CART", 
            payload: cartResponse.data 
          })
        }
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
    }
  }

  const clearCart = async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_CART" })
      return
    }

    try {
      const response = await cartService.clearCart(token)
      if (response.success) {
        dispatch({ type: "CLEAR_CART" })
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const toggleWishlist = (product) => {
    dispatch({ type: "TOGGLE_WISHLIST", payload: product })
  }

  const moveToCart = async (productId) => {
    const product = state.wishlist.find(item => item._id === productId)
    if (product) {
      const success = await addItem(product, 1, {})
      if (success) {
        dispatch({ type: "TOGGLE_WISHLIST", payload: product })
      }
    }
  }

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" })
  }

  const applyCoupon = async (couponCode) => {
    if (!isAuthenticated) {
      // Cupones locales para usuarios no autenticados
      const validCoupons = {
        'KILLA10': { code: 'KILLA10', discount: 10, type: 'percentage' },
        'ENVIOGRATIS': { code: 'ENVIOGRATIS', discount: 15000, type: 'fixed' },
        'BIENVENIDO': { code: 'BIENVENIDO', discount: 15, type: 'percentage' }
      }
      
      const coupon = validCoupons[couponCode.toUpperCase()]
      if (coupon) {
        dispatch({ type: "APPLY_COUPON", payload: coupon })
        return true
      }
      return false
    }

    try {
      const response = await cartService.applyCoupon(couponCode, token)
      if (response.success) {
        dispatch({ type: "APPLY_COUPON", payload: response.data.coupon })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const removeCoupon = async () => {
    dispatch({ type: "REMOVE_COUPON" })
    // En una implementación real, necesitarías una llamada al backend para remover el cupón
  }

  // Helper functions
  const getTotal = () => {
    return state.subtotal || state.items.reduce((total, item) => {
      const itemPrice = item.price || item.product?.price || 0
      return total + (itemPrice * item.quantity)
    }, 0)
  }

  const getDiscount = () => {
    return state.discount || 0
  }

  const getFinalTotal = () => {
    return state.total || getTotal()
  }

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getWishlistCount = () => {
    return state.wishlist.length
  }

  const isInWishlist = (productId) => {
    return state.wishlist.some(item => item._id === productId)
  }

  const syncCart = async () => {
    if (isAuthenticated && token) {
      try {
        const response = await cartService.getCart(token)
        if (response.success) {
          dispatch({ 
            type: "SET_CART", 
            payload: response.data 
          })
        }
      } catch (error) {
        console.error("Error syncing cart:", error)
      }
    }
  }

  const value = {
    // Estado
    items: state.items,
    wishlist: state.wishlist,
    coupon: state.coupon,
    isLoading: state.loading,
    
    // Acciones del carrito
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    
    // Wishlist
    toggleWishlist,
    isInWishlist,
    moveToCart,
    clearWishlist,
    getWishlistCount,
    
    // Cupones
    applyCoupon,
    removeCoupon,
    
    // Helpers
    getItemCount,
    getTotal,
    getDiscount,
    getFinalTotal,
    syncCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}