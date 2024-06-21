import requests
import json
import webbrowser

# Khalti API endpoint and payload
url = "https://a.khalti.com/api/v2/epayment/initiate/"
payload = {
    "return_url": "http://example.com/",
    "website_url": "https://example.com/",
    "amount": "1000",
    "purchase_order_id": "Order01",
    "purchase_order_name": "test",
    "customer_info": {
        "name": "Ram Bahadur",
        "email": "test@khalti.com",
        "phone": "9800000001"
    }
}

headers = {
    'Authorization': 'key live_secret_key_68791341fdd94846a146f0457ff7b455',
    'Content-Type': 'application/json',
}

# Sending POST request to Khalti API
response = requests.post(url, headers=headers, json=payload)

if response.status_code == 200:
    try:
        responseData = response.json()
        paymentUrl = responseData.get('payment_url', '')
        
        if paymentUrl:
            # Open the payment URL in the default web browser
            webbrowser.open(paymentUrl)
        else:
            print('Payment URL not found in response')
    except json.JSONDecodeError as e:
        print('Failed to parse JSON response:', e)
else:
    print('Failed to initiate Khalti payment:', response.status_code)
