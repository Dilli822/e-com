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
            combined_orders[key]['seller_id'].append(order.seller_id)
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
                'seller_id': [order.seller_id],  # Initialize seller_id as a list
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
        product_names_str = ', '.join(map(str, order_data['product_names']))
        product_units_str = ', '.join(map(str, order_data['product_units']))
        product_categories_str = ', '.join(map(str, order_data['product_categories']))
        product_prices_str = ', '.join(map(str, order_data['product_prices']))
        seller_id_str = ', '.join(map(str, order_data['seller_id']))
        
        print("Debugging product_categories_str:", product_categories_str)  # Debugging statement
        
        OrderArchive.objects.create(
            order_id=order_data['order_id'],
            seller_id=seller_id_str,
            product_names=product_names_str,
            product_descriptions=product_categories_str,
            product_prices=product_prices_str,
            product_categories=', '.join(order_data['product_categories']),
            product_category_names=', '.join(order_data['product_category_names']),
            product_units=product_units_str,
            product_total_units=order_data['product_total_units'],
            product_total_price=order_data['product_total_price'],
            delivery_fee=order_data['delivery_fee'],
            mode_of_payment=order_data['mode_of_payment']
        )
