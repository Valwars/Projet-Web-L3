import { useEffect } from "react";
import MultiStepForm from "../components/multiForm/MultiStepForm";
import { ToastContainer } from "react-toastify";

const FirstLoad = ({ user }) => {
  return (
    <div>
      <i class="fas fa-hand-holding-heart formicon"></i>

      <MultiStepForm user={user}></MultiStepForm>
      <ToastContainer />
    </div>
  );
};

export default FirstLoad;
