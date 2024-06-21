import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const EsewaPayment = () => {
  const [formData, setFormData] = useState({
    amount: '100',
    tax_amount: '0',
    total_amount: '100',
    transaction_uuid: '11-200-111sss1',
    product_code: 'EPAYTEST',
    product_service_charge: '0',
    product_delivery_charge: '0',
    success_url: 'https://developer.esewa.com.np/success',
    failure_url: 'https://developer.esewa.com.np/failure',
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: '4Ov7pCI1zIOdwtV2BRMUNjz1upIlT/COTxfLhWvVurE=',
    secret: '8gBm/:&EnhH.1/q',
  });

  const generateSignature = () => {
    const currentTime = new Date();
    const formattedTime = `${currentTime.toISOString().slice(2, 10).replace(/-/g, '')}-${currentTime.getHours()}${currentTime.getMinutes()}${currentTime.getSeconds()}`;
    const newTransactionUUID = formattedTime;

    const { total_amount, product_code, secret } = formData;

    const hash = CryptoJS.HmacSHA256(
      `total_amount=${total_amount},transaction_uuid=${newTransactionUUID},product_code=${product_code}`,
      secret
    );
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

    setFormData({
      ...formData,
      transaction_uuid: newTransactionUUID,
      signature: hashInBase64,
    });
  };

  useEffect(() => {
    generateSignature();
  }, [formData.total_amount, formData.transaction_uuid, formData.product_code, formData.secret]);

  const handleSubmit = (e) => {
    e.preventDefault();
    generateSignature();
    // Submitting the form
    e.target.submit();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <style>
        {`
          b {
            color: #e96900;
            padding: 3px 5px;
          }
        `}
      </style>
      {/* <b>eSewa ID:</b> 9806800001/2/3/4/5 <br />
      <b>Password:</b> Nepal@123 <b>MPIN:</b> 1122 <b>Token:</b>123456 */}

      <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" onSubmit={handleSubmit} target="_blank">
        <table style={{ display: 'none' }}>
          <tbody>
            <tr>
              <td><strong>Parameter </strong></td>
              <td><strong>Value</strong></td>
            </tr>

            <tr>
              <td>Amount:</td>
              <td>
                <input type="text" id="amount" name="amount" value={formData.amount} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Tax Amount:</td>
              <td>
                <input type="text" id="tax_amount" name="tax_amount" value={formData.tax_amount} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Total Amount:</td>
              <td>
                <input type="text" id="total_amount" name="total_amount" value={formData.total_amount} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Transaction UUID:</td>
              <td>
                <input type="text" id="transaction_uuid" name="transaction_uuid" value={formData.transaction_uuid} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Product Code:</td>
              <td>
                <input type="text" id="product_code" name="product_code" value={formData.product_code} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Product Service Charge:</td>
              <td>
                <input type="text" id="product_service_charge" name="product_service_charge" value={formData.product_service_charge} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Product Delivery Charge:</td>
              <td>
                <input type="text" id="product_delivery_charge" name="product_delivery_charge" value={formData.product_delivery_charge} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Success URL:</td>
              <td>
                <input type="text" id="success_url" name="success_url" value={formData.success_url} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Failure URL:</td>
              <td>
                <input type="text" id="failure_url" name="failure_url" value={formData.failure_url} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>signed Field Names:</td>
              <td>
                <input type="text" id="signed_field_names" name="signed_field_names" value={formData.signed_field_names} className="form" required onChange={handleChange} />
              </td>
            </tr>

            <tr>
              <td>Signature:</td>
              <td>
                <input type="text" id="signature" name="signature" value={formData.signature} className="form" required onChange={handleChange} />
              </td>
            </tr>
            <tr>
              <td>Secret Key:</td>
              <td>
                <input type="text" id="secret" name="secret" value={formData.secret} className="form" required onChange={handleChange} />
              </td>
            </tr>
          </tbody>
        </table>
        <input value="Pay With e-Sewa" type="submit" className="button" style={{ display: 'block', backgroundColor: 'transparent', cursor: 'pointer', color: '#000', border: 'none', width: "100%", fontSize: "16px"}} />
      </form>
    </div>
  );
};

export default EsewaPayment;
