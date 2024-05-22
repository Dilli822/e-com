import ConfirmationModal from "../confirmation/delete-confirm-modal"; // Import the ConfirmationModal component
import OrderPlaceConfirmationModal from "../confirmation/order-place-confirm-modal";
import React, { useEffect, useState } from "react";

export function CartConfirmation(){

    const [showConfirmation, setShowConfirmation] = useState(false); // State to manage the visibility of the confirmation modal
    const [showOrderPlaceConfirmation, setshowOrderPlaceConfirmation] =useState(false);
    const [ItemToPlaceOrder, setItemToPlaceOrder] = useState(null);
    const [selectedOrderingItems, setselectedOrderingItems] = useState([]); // Array to hold selected items
    const [totalPrices, setTotalPrices] = useState({});
    
    const [itemToDelete, setItemToDelete] = useState(null); // State to store the ID of the item to be deleted
    const [cartItems, setCartItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [itemQuantities, setItemQuantities] = useState({});
    
    const confirmOrderPlaceItem = () => {
        setShowConfirmation(false); // Hide the confirmation modal
        setItemToDelete(null);
      };
    
      const cancelOrderPlaceItem = () => {
        setshowOrderPlaceConfirmation(false); // Hide the confirmation modal
        setItemToPlaceOrder(null);
      };

      const confirmDeleteItem = () => {
        const updatedCartItems = cartItems.filter(
          (item) => item.id !== itemToDelete
        );
        setCartItems(updatedCartItems);
        setCheckedItems({ ...checkedItems, [itemToDelete]: false });
        delete itemQuantities[itemToDelete];
        delete totalPrices[itemToDelete];
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update localStorage
        setShowConfirmation(false); // Hide the confirmation modal after deletion
        setItemToDelete(null);
      };
    
      const cancelDeleteItem = () => {
        setShowConfirmation(false); // Hide the confirmation modal
        setItemToDelete(null);
      };


      const handleDeleteItem = (itemId) => {
        setShowConfirmation(true); // Show the confirmation modal
        setItemToDelete(itemId); // Set the ID of the item to be deleted
      };


    
      const handlePlaceOrder = () => {
        setshowOrderPlaceConfirmation(true);
      };
    
    return(
        <>
                {/* Confirmation Modal */}
                <ConfirmationModal
          open={showConfirmation}
          handleClose={cancelDeleteItem}
          handleConfirm={confirmDeleteItem}
        />
        <OrderPlaceConfirmationModal
          open={showOrderPlaceConfirmation}
          handleClose={cancelOrderPlaceItem}
          handleConfirm={confirmOrderPlaceItem}
        />
        </>
    )
}