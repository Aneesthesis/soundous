export const CheckoutProgress = (props) => {
  const totalSteps = 4; // Total number of steps in the checkout process

  // Calculate the number of completed steps
  let completedSteps = 0;

  if (props.step1) {
    completedSteps = 1;
  }

  if (props.step2) {
    completedSteps = 2;
  }

  if (props.step3) {
    completedSteps = 3;
  }

  if (props.step4) {
    completedSteps = 4;
  }

  // Calculate the percentage of completion
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div>
      <div className=" flex justify-around gap-x-4 md:gap-x-44">
        <div className={props.step1 ? "text-yellow-400" : "text-gray-400"}>
          Sign In
        </div>
        <div className={props.step2 ? "text-yellow-400" : "text-gray-400"}>
          Shipping
        </div>
        <div className={props.step3 ? "text-yellow-400" : "text-gray-400"}>
          Payment
        </div>
        <div className={props.step4 ? "text-yellow-400" : "text-gray-400"}>
          Order Placed
        </div>
      </div>
      <div className=" ">
        <div className="h-2 bg-gray-200 w-full rounded-full">
          {/* Completed progress */}
          <div
            className="h-2 bg-yellow-400 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
