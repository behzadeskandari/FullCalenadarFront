import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TOOLS_BOX_EDIT_MODE } from 'components/Hybrids/ToolsBox/constants';
import { addAction } from 'store/actions/actionsBarActions';
import PageTitle from 'components/Hybrids/GridSectionContainers/Components/PageTitle/index';
import MainStepper from 'components/Infrastructures/MainStepper/index';
import {
  stepItemsTradeToStorage,
  secondStepItemsTradeToStorage,
  threeStepItemsTradeToStorage
} from './newTransfer/stepItems';
import {
  stepContentsTradeToStorage,
  secondStepContentsTradeToStorage,
  ThreeStepContentsTradeToStorage
} from './newTransfer/stepContents';
import { updateStepByEnum } from 'store/actions/newTransferActions';
import MainStepperTrasfer from './MainStepperTransfer/index';
//import { StorageToTrade, updateStepContent, updateStepItem } from 'store/actions/newTransferActions';

export default function TransferStep() {
  const state = useSelector((state) => state);
  const enumPayload = useSelector((state) => state.stepContentReducer.enumPayload);

  const [currentStep, setCurrentStep] = React.useState(2);
  const dispatch = useDispatch();

  React.useEffect(() => {}, []);

  const StepHandler = (enumPayload) => {
    console.log(enumPayload, 'enumPayload');
    switch (enumPayload) {
      case undefined:
        dispatch(updateStepByEnum(1));
        break;
      case 1:
        if (stepItemsTradeToStorage && stepContentsTradeToStorage) {
          return (
            <MainStepperTrasfer
              stepItems={stepItemsTradeToStorage}
              stepContents={stepContentsTradeToStorage}
              isNextStepAllowed={true}
            />
          );
        }
        break;
      case 2:
        if (secondStepItemsTradeToStorage && secondStepContentsTradeToStorage) {
          return (
            <MainStepperTrasfer
              stepItems={secondStepItemsTradeToStorage}
              stepContents={secondStepContentsTradeToStorage}
              isNextStepAllowed={true}
            />
          );
        }
        break;
      case 3:
        if (threeStepItemsTradeToStorage && ThreeStepContentsTradeToStorage) {
          return (
            <MainStepperTrasfer
              stepItems={threeStepItemsTradeToStorage}
              stepContents={ThreeStepContentsTradeToStorage}
              isNextStepAllowed={true}
            />
          );
        }
        break;
      default:
        dispatch(updateStepByEnum(1));
        break; // or any other fallback component or content
    }
  };
  const handleSetCurrentStep = (step = 1) => {
    setCurrentStep(step);
  };
  return (
    <>
      <PageTitle title="NEW_TRANSFER" />
      {StepHandler(enumPayload)}
    </>
  );
}
