import React from "react";
import { Button } from "@material-ui/core";
const KhaltiPayment = () => {
  const initiateKhaltiPayment = async () => {
    const url = "https://a.khalti.com/api/v2/epayment/initiate/";
    const payload = {
      return_url: "http://example.com/",
      website_url: "https://example.com/",
      amount: "1000",
      purchase_order_id: "Order01",
      purchase_order_name: "test",
      customer_info: {
        name: "Ram Bahadur",
        email: "test@khalti.com",
        phone: "9800000001",
      },
    };

    const headers = {
      Authorization: "key live_secret_key_68791341fdd94846a146f0457ff7b455",
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        const paymentUrl = responseData.payment_url;

        if (paymentUrl) {
          window.open(paymentUrl, "_blank");
        } else {
          console.log("Payment URL not found in response");
        }
      } else {
        console.log("Failed to initiate Khalti payment:", response.status);
      }
    } catch (error) {
      console.error("Error initiating Khalti payment:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" fullWidth onClick={initiateKhaltiPayment}>
        Pay with Khalti
      </Button>
    </div>
  );
};

export default KhaltiPayment;
