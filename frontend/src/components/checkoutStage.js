export const CheckoutProgress = (props) => {
  return (
    <div className="flex justify-around gap-x-4">
      <div className={props.step1 ? "text-amber-400" : "text-gray-400"}>
        Sign In
      </div>
      <div className={props.step2 ? "text-amber-400" : "text-gray-400"}>
        Shipping
      </div>
      <div className={props.step3 ? "text-amber-400" : "text-gray-400"}>
        Payment
      </div>
      <div className={props.step4 ? "text-amber-400" : "text-gray-400"}>
        Order Placed
      </div>
    </div>
  );
};
