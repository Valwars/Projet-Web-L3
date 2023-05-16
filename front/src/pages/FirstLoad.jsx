import { useEffect } from "react";
import MultiStepForm from "../components/multiForm/MultiStepForm";
import { ToastContainer } from "react-toastify";

const FirstLoad = () => {
  
  return (
    <div>
      <i class="fas fa-hand-holding-heart formicon"></i>

      <MultiStepForm></MultiStepForm>
      <ToastContainer />
    </div>
  );
};

export default FirstLoad;
