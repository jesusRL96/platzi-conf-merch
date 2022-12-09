import React, { useContext } from 'react';
import '../styles/components/Payment.css';
import AppContext from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';

const Payment = () => {
  const { state, addNewOrder } = useContext(AppContext);
  const { cart, buyer } = state;
  const navigate = useNavigate();

  const paypalOptions = {
    clientId: '',
    intent: 'capture',
    currency: 'USD',
  };

  const buttonStyles = {
    layout: 'vertical',
    shape: 'rect',
  };

  const handlePaymentSuccess = (data) => {
    console.log(data);
    if (data.status === 'COMPLETED') {
      const newOrder = {
        buyer,
        product: cart,
        payment: data,
      };
      addNewOrder(newOrder);
      navigate('/checkout/success');
    }
  };
	

	const createOrder = (data, actions) => {
			return actions.order.create({
				purchase_units: [
					{
						amount: {
							value: handleSumtotal()
						},
					},
				],
			});
		};
	const onApprove = (data, actions) => {
		return actions.order.capture().then(function(data) {
		handlePaymentSuccess(data);
					 });
	};

  const handleSumtotal = () => {
    const reducer = (accumulator, currentValue) =>
      accumulator + currentValue.price;
    const sum = cart.reduce(reducer, 0);
    return sum;
  };

  return (
    <div className="Payment">
      <div className="Payment-content">
        <h3>Resumen del pedido:</h3>
        {cart.map((item) => (
          <div className="Payment-item" key={item.title}>
            <div className="Payment-element">
              <h4>{item.title}</h4>
              <h4>${item.price}</h4>
            </div>
          </div>
        ))}
        <div className="Payment-button">
          <PayPalButton
            paypalOptions={paypalOptions}
            buttonStyles={buttonStyles}
            /* amout={handleSumtotal()} */
						createOrder={(data, actions) => createOrder(data, actions)}
						onApprove={(data, actions) => onApprove(data, actions)}
            onSuccess={(data) => handlePaymentSuccess(data)}
            onError={(error) => console.log(error)}
            onCancel={(data) => console.log(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
