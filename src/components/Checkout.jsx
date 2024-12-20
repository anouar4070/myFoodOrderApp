import { useContext, useActionState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/cardContaxt";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const {
    data,
    // isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  async function checkoutAction(prevState, fd) {
    const customerData = Object.fromEntries(fd.entries()); //{email: g.anouar@yahoo.com}

    await sendRequest(
      JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      })
    );
  }

  const [formState, formAction, isSending] = useActionState(
    checkoutAction,
    null
  );

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form action={formAction}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)} </p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="Email Address" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-raw">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}

//& approach with React version < 19
// import { useContext } from "react";
// import Modal from "./UI/Modal";
// import CartContext from "../store/cardContaxt";
// import { currencyFormatter } from "../util/formatting";
// import Input from "./UI/Input";
// import Button from "./UI/Button";
// import UserProgressContext from "../store/UserProgressContext";
// import useHttp from "../hooks/useHttp";
// import Error from "./Error";

// const requestConfig = {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// export default function Checkout() {
//   const cartCtx = useContext(CartContext);
//   const userProgressCtx = useContext(UserProgressContext);

//   const {
//     data,
//     isLoading: isSending,
//     error,
//     sendRequest,
//     clearData,
//   } = useHttp("http://localhost:3000/orders", requestConfig);

//   const cartTotal = cartCtx.items.reduce(
//     (totalPrice, item) => totalPrice + item.quantity * item.price,
//     0
//   );

//   function handleClose() {
//     userProgressCtx.hideCheckout();
//   }

//   function handleFinish() {
//     userProgressCtx.hideCheckout();
//     cartCtx.clearCart();
//     clearData();
//   }

//   function handleSubmit(event) {
//     event.preventDefault();

//     const fd = new FormData(event.target);
//     const customerData = Object.fromEntries(fd.entries()); //{email: g.anouar@yahoo.com}

//     sendRequest(
//       JSON.stringify({
//         order: {
//           items: cartCtx.items,
//           customer: customerData,
//         },
//       })
//     );
//   }

//   let actions = (
//     <>
//       <Button type="button" textOnly onClick={handleClose}>
//         Close
//       </Button>
//       <Button>Submit Order</Button>
//     </>
//   );

//   if (isSending) {
//     actions = <span>Sending order data...</span>;
//   }

//   if (data && !error) {
//     return (
//       <Modal
//         open={userProgressCtx.progress === "checkout"}
//         onClose={handleFinish}
//       >
//         <h2>Success!</h2>
//         <p>Your order was submitted successfully.</p>
//         <p>
//           We will get back to you with more details via email within the next
//           few minutes.
//         </p>
//         <p className="modal-actions">
//           <Button onClick={handleFinish}>Okay</Button>
//         </p>
//       </Modal>
//     );
//   }

//   return (
//     <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
//       <form onSubmit={handleSubmit}>
//         <h2>Checkout</h2>
//         <p>Total Amount: {currencyFormatter.format(cartTotal)} </p>

//         <Input label="Full Name" type="text" id="name" />
//         <Input label="Email Address" type="email" id="email" />
//         <Input label="Street" type="text" id="street" />
//         <div className="control-raw">
//           <Input label="Postal Code" type="text" id="postal-code" />
//           <Input label="City" type="text" id="city" />
//         </div>

//         {error && <Error title="Failed to submit order" message={error} />}

//         <p className="modal-actions">{actions}</p>
//       </form>
//     </Modal>
//   );
// }

//& without custom useHttp.js hook
// import { useContext } from "react";
// import Modal from "./UI/Modal";
// import CartContext from "../store/cardContaxt";
// import { currencyFormatter } from "../util/formatting";
// import Input from "./UI/Input";
// import Button from "./UI/Button";
// import UserProgressContext from "../store/UserProgressContext";

// export default function Checkout() {
//   const cartCtx = useContext(CartContext);
//   const userProgressCtx = useContext(UserProgressContext);

//   const cartTotal = cartCtx.items.reduce(
//     (totalPrice, item) => totalPrice + item.quantity * item.price,
//     0
//   );

//   function handleClose() {
//     userProgressCtx.hideCheckout();
//   }

//   function handleSubmit(event) {
//     event.preventDefault();

//   //Extracting the data entered by the user
//     const fd = new FormData(event.target);
//     const customerData = Object.fromEntries(fd.entries()); //{email: g.anouar@yahoo.com}

// //Sending POST req with Order Data
//     fetch('http://localhost:3000/orders', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         order: {
//           items: cartCtx.items,
//           customer: customerData
//         }
//       })
//     })

//   }

//   return (
//     <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
//       <form onSubmit={handleSubmit}>
//         <h2>Checkout</h2>
//         <p>Total Amount: {currencyFormatter.format(cartTotal)} </p>

//         <Input label="Full Name" type="text" id="name" />
//         <Input label="Email Address" type="email" id="email" />
//         <Input label="Street" type="text" id="street" />
//         <div className="control-raw">
//           <Input label="Postal Code" type="text" id="postal-code" />
//           <Input label="City" type="text" id="city" />
//         </div>

//         <p className="modal-actions">
//           <Button type="button" textOnly onClick={handleClose}>
//             Close
//           </Button>
//           <Button>Submit Order</Button>
//         </p>
//       </form>
//     </Modal>
//   );
// }
