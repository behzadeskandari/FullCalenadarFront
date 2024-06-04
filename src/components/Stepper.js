import React from "react";
import "./stepper.css";
export default function Stepper({ ComponentList, ComponentLenght }) {
  const [step, setStep] = React.useState(0);
  const lenght = ComponentLenght;
  const onPrevClick = () => {
    if (step > 0) setStep(step - 1);
  };
  const onNextClick = () => {
    if (step < lenght - 1) setStep(step + 1);
  };

  const StepElement = ({ currentStep }) => {
    const element = [];
    for (let index = 0; index < lenght; index++) {
      element.push(
        // <div>
        <span className={currentStep >= index ? "step active" : "step"}>
          {index + 1}
        </span>
      );
    }
    return element;
  };

  return (
    <div className="Container">
      <div id="step-wrapper">
        <StepElement currentStep={step}></StepElement>
        <div
          id="progress"
          style={{ width: `${(step / (lenght - 1)) * 26}%` }}
        ></div>
      </div>
      <div className="CompnentList">{ComponentList[step]}</div>
      <div>
        <button id="prev" onClick={onPrevClick}>
          Previous
        </button>
        <button id="next" onClick={onNextClick}>
          Next
        </button>
      </div>
    </div>
  );
}

/* <span
            className={
              currentStep >= index ? `line line-active ` : `line line-hidden`
            }
          ></span> 
         </div> */
