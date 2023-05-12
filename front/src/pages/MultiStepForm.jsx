import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import('../multistep.css');

const Step1 = ({ values, handleChange }) => {
    return (
        <form className="multisteps">
            <div className="fields">
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                />
            </div>
            <div className="fields">
                <label>First name</label>
                <input
                    type="text"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};

const Step2 = ({ values, handleChange }) => {
    return (
        <form className="multisteps">
            <div className="fields">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={values.localisation}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};

const Step3 = ({ values, handleChange }) => {
    return (
        <form className="multisteps">
            <div className="fields">
                <label>Age</label>
                <input
                    type="number"
                    name="age"
                    min="1"
                    value={values.age}
                    onChange={handleChange}
                />
            </div>
        </form>
    );
};

const MultiStepForm = () => {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [values, setValues] = useState({
        pdp: "",
        photos: [],
        name: "",
        firstname: "",
        age: "",
        sexe: "",
        orientation: "",
        description: "",
        interests: [],
        localisation: "",
    });

    const [transition, setTransition] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const nextStep = (side) => {
        setTransition(side);
        setTimeout(() => {
            setStep(step + 1);
            setTransition("");
        }, 500);
    };
    const prevStep = (side) => {
        setTransition(side);
        setTimeout(() => {
            setStep(step - 1);
            setTransition("");
        }, 500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);
        setSubmitted(true);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 values={values} handleChange={handleChange} />;
            case 2:
                return <Step2 values={values} handleChange={handleChange} />;
            case 3:
                return <Step3 values={values} handleChange={handleChange} />;
            default:
                // je dois ajouter le user dans le localstorage pour qu'il reste co est qu'il continue sa route
                // localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, );
                // je navigue vers la page principale après connexion car la création de son profil vient de terminer
                return navigate('/');
        }
    };

    return (
        <>
            {submitted ? (
                <h1>Form submitted</h1>
            ) : (
                <div className={"container " + transition}>
                    {renderStep()}
                    <div className="btncontainer">
                        {step > 1 && (
                            <button onClick={() => prevStep("animate-left")}>Previous</button>
                        )}
                        {step < 3 && (
                            <button onClick={() => nextStep("animate-right")}>Next</button>
                        )}
                        {step === 3 && <button onClick={handleSubmit}>Submit</button>}
                    </div>
                </div>
            )}
        </>
    );
};

export default MultiStepForm;