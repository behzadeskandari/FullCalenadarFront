import React, { createContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import exactPropTypes from 'prop-types-exact';
import { getObjectFromURL, makeSearchParams, pushOrReplaceQueryParams } from 'router/routing';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../../../../../node_modules/antd/lib/index';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentStep } from 'store/actions/newTransferActions';
export const StepContextTransfer = createContext();
export default function MainStepperTrasfer({
  stepItems = [],
  initialCurrentStep = 1,
  stepContents,
  isNextStepAllowed,
  setExposedCurrentStep,
  upperMenuDisabled,
  onFinalStep // @Tony: This function is called whenever the step items are over but we need to call a final callback function
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = getObjectFromURL();
  const urlObject = getObjectFromURL();

  const dispatch = useDispatch();
  const currentStepState = useSelector((state) => state.currentStep);

  const [stepperData, setStepperData] = useState();
  const [mainStepperMount, setMainStepperMount] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialCurrentStep);
  const ref = useRef();

  useEffect(() => {
    if (currentStepState && currentStepState > 0) {
      setCurrentStep(currentStepState);
    }
    setExposedCurrentStep?.(currentStep);
  }, [currentStep, currentStepState, setExposedCurrentStep]);

  const handleStepperData = (data) => {
    setStepperData({ ...stepperData, ...data });
  };
  const handleCurrentStep = (currentStep) => {
    dispatch(updateCurrentStep(currentStep));
    setCurrentStep(currentStep);
  };
  const onChange = (current) => {
    dispatch(updateCurrentStep(current));
    setCurrentStep(current);
  };

  const prev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      dispatch(updateCurrentStep(currentStep - 1));
    }
  };

  const next = () => {
    if (stepItems.length > currentStep) {
      setCurrentStep(currentStep + 1);
      dispatch(updateCurrentStep(currentStep + 1));
    } else {
      onFinalStep();
    }
  };

  useEffect(() => {
    if (currentStepState && currentStepState > 0) {
      setCurrentStep(currentStepState);
    }
    if (currentStep === 1) {
      // -- in first step we should not have these params in URL
      delete queryParams['batchNo'];
      delete queryParams['piNo'];
      delete queryParams['locationId'];
    }

    if (mainStepperMount) {
      pushOrReplaceQueryParams({ ...queryParams, step: currentStep });
    }
  }, [currentStep, mainStepperMount, queryParams]);

  useEffect(() => {
    if (currentStepState && currentStepState > 0) {
      setCurrentStep(currentStepState);
    }
    setMainStepperMount(true);
    const locationId = urlObject.locationId;
    let step;
    const PiNo = urlObject.piNo;
    const truckId = urlObject.truckId;
    const pi = urlObject.pi;

    if (Number(urlObject.step) > 2 && !locationId && !PiNo && !truckId) {
      // -- for batch-invoice stepper page --
      step = 3;
    } else if (Number(urlObject.step) > 0) {
      // -- for other pages --
      step = Number(urlObject.step);
    } else {
      // -- when giving negative number in URL
      step = 1;
    }
    const batchNumber = urlObject.batchNo;
    const rentalAgentId = urlObject.rentalAgentId;

    if (step) {
      if (batchNumber && locationId) {
        // -- for sales physical inventory stepper page --
        dispatch(updateCurrentStep(Number(step)));
        handleCurrentStep(Number(step));
        handleStepperData({
          batchNo: batchNumber,
          filter: { batchNo: batchNumber, locationId: locationId },
          isStepThreeDisable: false
        });
        navigate('/login');
      } else if (batchNumber) {
        // -- for batch-invoice stepper page --
        handleCurrentStep(Number(step));
        dispatch(updateCurrentStep(Number(step)));
        handleStepperData({
          batchNo: batchNumber,
          filters: { locationId, rentalAgentId },
          isStepThreeDisable: false
        });
        navigate({
          pathname: location?.pathname,
          search: `step=${step}&batchNo=${batchNumber}`
        });
      } else if (queryParams['productionId']) {
        handleCurrentStep(Number(step));
        // for checkout sheet stepper page
        dispatch(updateCurrentStep(Number(step)));
      } else if (PiNo) {
        handleCurrentStep(Number(step));
        // -- for rental physical inventory stepper page --
        dispatch(updateCurrentStep(Number(step)));
        handleStepperData({
          PiNo: PiNo,
          filters: { locationId },
          isStepThreeDisable: false
        });
        navigate({
          pathname: location?.pathname,
          search: `step=${step}&piNo=${PiNo}&locationId=${locationId}`
        });
      } else if (truckId) {
        handleCurrentStep(Number(step));
        // -- for rental truck physical inventory stepper page --
        dispatch(updateCurrentStep(Number(step)));
        handleStepperData({
          truckId: truckId,
          filters: { locationId },
          isStepThreeDisable: false
        });

        const searchParams = makeSearchParams({ step, truckId, pi });
        navigate({
          pathname: location?.pathname,
          search: searchParams
        });
      }
    }
  }, []);

  const _renderStepItem = (step, index) => {
    const { id, iconName, title, description, isDisable } = step;
    return (
      <div
        className={classNames('steps-item steps-item-process steps-item-custom', {
          'steps-item-active': !isDisable,
          'steps-item-disabled': isDisable
        })}
        key={id}
        onClick={() => {
          if (!upperMenuDisabled) onChange(index);
        }}>
        <div
          role="button"
          tabIndex={index}
          className={classNames('steps-item-container', {
            'current-step': index === currentStep
          })}>
          <div className="steps-item-icon">
            <span className="steps-icon">{iconName}</span>
          </div>
          <div className="steps-item-content">
            <div className="steps-item-title">
              <div className="more-options">
                <span className="dropdown-trigger">{title}</span>
              </div>
            </div>
            <div className={description && 'steps-item-description'}>
              <div className="description-step-container">{description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="stepper-parent-container">
      <div className="stepper-container">
        <div className="stepper-steps">
          {stepItems &&
            stepItems.map((step, index) => {
              if (!isNextStepAllowed) {
                step.isDisable = index > currentStep - 1;
              }
              return _renderStepItem(step, index + 1);
            })}
        </div>
      </div>

      <div className="steps-content">
        <StepContextTransfer.Provider
          value={{
            stepperData,
            currentStep,
            handleStepperData,
            handleCurrentStep,
            ref
          }}>
          {stepContents()?.[currentStep - 1]?.component}
        </StepContextTransfer.Provider>
      </div>
      <div className="sep-button">
        <Button onClick={prev}>Previous</Button>
        <Button type="primary" onClick={next} disabled={!isNextStepAllowed}>
          Next
        </Button>
      </div>
    </div>
  );
}

MainStepperTrasfer.propTypes = exactPropTypes({
  stepItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      iconName: PropTypes.node.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      isDisable: PropTypes.bool
    })
  ).isRequired,
  stepContents: PropTypes.func.isRequired,
  initialCurrentStep: PropTypes.number,
  isNextStepAllowed: PropTypes.bool,
  setExposedCurrentStep: PropTypes.func,
  upperMenuDisabled: PropTypes.bool,
  onFinalStep: PropTypes.func.isRequired
});
