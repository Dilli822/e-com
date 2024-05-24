

from .models import Order_For_Seller, OrderArchive

def extract_and_store_orders():
    # Filter orders based on the conditions you specified
    orders_to_extract = Order_For_Seller.objects.filter(order_shipped=True, order_pending=False)

    # Initialize a dictionary to store combined orders
    combined_orders = {}

    # Iterate over filtered orders
    for order in orders_to_extract:
        # Create a unique key based on order_id and buyer_id
        key = (order.order_id, order.buyer_id)

        # Check if the order meets the condition and add it to the combined_orders dictionary
        if key in combined_orders:
            # If the key exists, update the values of product-related fields
            combined_orders[key]['product_names'].append(order.product_name)
            combined_orders[key]['product_descriptions'].append(order.product_description)
            combined_orders[key]['product_prices'].append(order.product_price)
            combined_orders[key]['product_categories'].append(order.product_category)
            combined_orders[key]['product_category_names'].append(order.product_category_name)
            combined_orders[key]['product_total_units'] += order.product_total_units
            combined_orders[key]['product_units'].append(order.product_units)
            combined_orders[key]['product_total_price'] += order.product_total_price
        else:
            # If the key doesn't exist, create a new entry in the dictionary
            combined_orders[key] = {
                'order_id': order.order_id,
                'buyer_id': order.buyer_id,
                'product_names': [order.product_name],
                'product_descriptions': [order.product_description],
                'product_prices': [order.product_price],
                'product_categories': [order.product_category],
                'product_category_names': [order.product_category_name],
                'product_total_units': order.product_total_units,
                'product_units': [order.product_units],
                'product_total_price': order.product_total_price,
                'delivery_fee': order.delivery_fee,
                'mode_of_payment': order.mode_of_payment
            }

    # Iterate over combined_orders dictionary and create OrderArchive instances
    for key, order_data in combined_orders.items():
        # Join product_units with commas while maintaining individual values
        product_units_str = ', '.join(map(str, order_data['product_units']))
        
        OrderArchive.objects.create(
            order_id=order_data['order_id'],
            buyer_id=order_data['buyer_id'],
            product_names=', '.join(order_data['product_names']),  # Forcefully join with commas
            product_descriptions=', '.join(order_data['product_descriptions']),  # Forcefully join with commas
            product_prices=', '.join(order_data['product_prices']),  # Forcefully join with commas
            product_categories=', '.join(order_data['product_categories']),  # Forcefully join with commas
            product_category_names=', '.join(order_data['product_category_names']),  # Forcefully join with commas
            product_total_units=order_data['product_total_units'],
            product_units=product_units_str,  # Assign the joined product units string
            product_total_price=order_data['product_total_price'],
            delivery_fee=order_data['delivery_fee'],
            mode_of_payment=order_data['mode_of_payment']
        )
