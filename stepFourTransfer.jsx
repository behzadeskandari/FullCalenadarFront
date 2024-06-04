import React, { useEffect, useCallback, useState, useId } from 'react';
import { useSelector } from 'react-redux';
import { TransferCard } from './TradeToStorage/TradeToStorage';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from '../TransfersDetails/newTransfer/newtransfer.module.scss';
import { updateCurrentStep, updateStepByEnum } from 'store/actions/newTransferActions';
import { useDispatch } from 'react-redux';
import GridDetailWrapper from 'components/Hybrids/GridDetailWrapper/index';
import {
  BUSINESSUNIT,
  TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME,
  TRANSFER_SCREEN_COLUMN_STATE_NAME
} from 'GeneratorCreatedFiles/constants/columnStateNames';
import useCurrentActiveTab from 'hooks/useCurrentActiveTab/index';
import TransferDetails from './TransferDetails/TransferDetails';
import {
  ADDRESS_TYPE,
  TRANSFERDETAIL,
  TRANSFERHEADER,
  TRANSFERHEADER_EXPANDED,
  TRANSFERSUBHEADER
} from 'GeneratorCreatedFiles/constants/api';
import { gridProps } from '../../BaseTables/AddressType/addressTypeGridProps';
import AddressTypeDetails from 'GeneratorCreatedFiles/views/BaseTables/AddressType/AddressTypeDetails';
import Loading from 'components/Infrastructures/Loading/Loading';

import ToolsBox from 'components/Hybrids/ToolsBox/index';
import AdvanceFormGenerator from 'components/Hybrids/Forms/AdvanceFormGenerator';
import { formItems, getTransferTradeToolsBox } from './TransferDetails/TradeItem';
import { formItemsVessel, getTransferVesselToolsBox } from './TransferDetails/VesselItem';
import useAppSelector from 'hooks/useAppSelector/index';
import StyledWrapperTransfer from './StyleWrapperTransfer/index';
import HttpHandler from 'services/httpService';
import Alert from 'components/Infrastructures/Alert/Alert';

export default function stepFourTransfer() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gridRef = React.useRef();

  const SentStepTwoPayload = useSelector((state) => state.stepContentReducer.SentStepTwoPayload);
  const SentStepThreePayload = useSelector(
    (state) => state.stepContentReducer.SentStepThreePayload
  );
  const ComponentName = useSelector((state) => state.stepContentReducer.componentName);
  const ComponentCount = useSelector((state) => state.stepContentReducer.ComponentCount);

  const [componentCount, setComponentCount] = React.useState(0);
  const [componentName, setComponentName] = React.useState(ComponentName);
  const [selectedCardId, setSelectedCardId] = React.useState(null);
  // const [changeBgColors, setChangeBgColors] = React.useState(Array(componentCount).fill(false));
  const [cardStates, setCardStates] = React.useState([]);
  const [tradetransferdetail, setTradeTransferDetail] = React.useState([]);
  const [isShowAlert, setIsShowAlert] = React.useState(false);
  const [vesselElement, setVesselElement] = React.useState([]);
  const [tradeElement, setTradeElement] = React.useState([]);
  const [tradelevel, setTradeLevel] = React.useState([]);
  console.log(componentCount, 'componentCount componentCount componentCount ');
  const [currentRow, setCurrentRow] = React.useState(null);

  const [dataCardStepTwo, setDataStepTwo] = React.useState(null);
  const [dataCardStepThree, setDataCardThree] = React.useState(null);
  const [CarId, setCarId] = React.useState(0);
  const [visibleHeaders, setVisibleHeaders] = React.useState({});
  const [cardTypeAndCountFromServer, serCardTypeAndCountFromServer] = React.useState([]);
  const [transferHeader, setTransferHeader] = React.useState([]);
  const [cardData, setCardData] = useState({});
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyCard, setIsEmptyCard] = useState(false);
  const toolsItemListTrade = React.useMemo(() => {
    return getTransferTradeToolsBox({
      addressAPI: TRANSFERDETAIL,
      gridRef,
      formName: TRANSFER_SCREEN_COLUMN_STATE_NAME
    });
  }, []);
  const toolsItemListVessel = React.useMemo(() => {
    return getTransferVesselToolsBox({
      addressAPI: TRANSFERDETAIL,
      gridRef,
      formName: TRANSFER_SCREEN_COLUMN_STATE_NAME
    });
  }, []);

  const initialValues = useAppSelector((state) => {
    return state?.formStatesReducer?.[TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME]?.currentRowData;
  });

  // const [showCard, setShowCard] = React.useState(false);
  // const current = useCurrentActiveTab(TRANSFER_SCREEN_COLUMN_STATE_NAME);
  const tabItems = React.useMemo(() => {
    return [
      {
        name: TRANSFER_SCREEN_COLUMN_STATE_NAME,
        label: 'DETAILS'
      },
      {
        name: BUSINESSUNIT,
        label: 'DETAILS'
      }
    ];
  }, []);

  const fetchData = async () => {
    const currentId = params.get('id');
    const currentPhysiclDealDetailId = params.get('physiclDealDetail');

    if (
      (!SentStepTwoPayload && !SentStepThreePayload) ||
      !currentId ||
      !currentPhysiclDealDetailId
    ) {
      handleNavigationToStepOne();
    } else {
      try {
        const httpHandler = new HttpHandler();
        const response = await httpHandler.get(`${TRANSFERSUBHEADER}?$expand=TransferDetails`);

        if (response.status === 200 || response.status === 201) {
          console.log(response);
          const count = response.data.value.length;
          serCardTypeAndCountFromServer(response.data.value);
          setComponentCount(count);
          if (count <= 0) {
            handleNavigationToStepOne();
          }
        }

        setDataStepTwo([SentStepTwoPayload]);
        setDataCardThree([SentStepThreePayload]);
        //setComponentCount(ComponentCount);
        //setComponentName(ComponentName);
        console.log(componentCount, 'COunt');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const fetchTradeTransferDetail = async (physicalDealDetailID) => {
    const httpHandler = new HttpHandler();
    try {
      const response = await httpHandler.get(
        `/web/transfer/gettradetransferdetail?detailId=${physicalDealDetailID}`
      );
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setTradeTransferDetail(response.data);
        let responsearr = [];
        responsearr.push(response.data);
        const tradeInfoElements = responsearr?.map(mapInfoToSpans);
        setTradeElement(tradeInfoElements);
      } else {
        throw new Error('Error in Trade Transfer Details');
      }
    } catch (error) {
      console.error('Error fetching trade transfer details:', error);
      setDescription('Error in fetching Trade Transfer Details');
      setIsShowAlert(true);
    }
  };

  const fetchTradeLevel = async (id) => {
    const httpHandler = new HttpHandler();
    try {
      const response = await httpHandler.get(`/web/transfer/gettradelevel?levelId=${id}`);
      if (response.status === 200 || response.status === 201) {
        console.log(response);
        setTradeLevel(response.data);
        let responsearr = [];
        responsearr.push(response.data);
        const vesselInfoElements = responsearr?.map(mapInfoToSpans);
        setVesselElement(vesselInfoElements);
      } else {
        throw new Error('Error in GetTradeLevel');
      }
    } catch (error) {
      console.error('Error fetching trade level:', error);
      setDescription('Error in fetching Trade Level');
      setIsShowAlert(true);
    }
  };

  const fetchCardData = async (Id, TransferHeaderID) => {
    try {
      setIsLoading(true);
      const httpHandler = new HttpHandler();
      const TransferResponse = await httpHandler.get(
        `${TRANSFERHEADER_EXPANDED}?$filter=(Id eq ${TransferHeaderID})`
      );

      if (TransferResponse.status === 200 || TransferResponse.status === 201) {
        console.log(TransferResponse);
        setTransferHeader(TransferResponse.data);
        // const httpHandlerSubHeader = new HttpHandler();
        // const TransferDetailsResponse = await httpHandlerSubHeader.get(
        //   `${TRANSFERDETAIL}?$filter=(TransferSubHeaderID eq ${DetailId})`
        // );
        const promises = [];

        for (let index = 0; index < cardTypeAndCountFromServer.length; index++) {
          const TransferDetailsData = cardTypeAndCountFromServer[index].TransferDetails;
          if (
            (TransferDetailsData.length > 0 && TransferDetailsData.StorageLevelID != null) ||
            TransferDetailsData.StorageLevelID != undefined
          ) {
            promises.push(fetchTradeLevel(TransferDetailsData.StorageLevelID));
          }
        }

        // Fetch Trade Level

        if (TransferResponse.data.value[0] != null || TransferResponse.data.value[0] != undefined) {
          const transferData = TransferResponse.data.value[0];
          if (transferData.PhysicalDealDetailID != null) {
            // Fetch Trade Transfer Detail
            promises.push(fetchTradeTransferDetail(transferData.PhysicalDealDetailID));
          }
        }

        // Wait for all promises to resolve
        if (promises.length > 0) {
          await Promise.all(promises);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching transfer header data:', error);
      setDescription('Error in fetching Transfer Header Data');
      setIsShowAlert(true);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (SentStepTwoPayload == undefined && SentStepThreePayload == undefined) {
      handleNavigationToStepOne();
    } else {
      fetchData();
    }
  }, []);

  React.useEffect(() => {
    fetchData();

    console.log(componentCount, ' XOUNT');
  }, [SentStepTwoPayload, SentStepThreePayload, componentCount, vesselElement, tradeElement]); //, ComponentName
  const handleAddCard = () => {
    dispatch(updateStepByEnum(1));
    handleNavigationToStepOne();
  };

  React.useEffect(() => {
    if (componentCount > 0) {
      setCardStates(
        Array.from({ length: componentCount }, (_, index) => ({
          id: cardTypeAndCountFromServer[index].TransferHeaderID, // Ensure unique IDs starting from 1
          isSelected: false
        }))
      );
    }
  }, [componentCount, cardTypeAndCountFromServer]);

  const handleHeaderClick = useCallback(
    (index) => {
      setVisibleHeaders((prevVisibleHeaders) => ({
        ...prevVisibleHeaders,
        [index]: !prevVisibleHeaders[index]
      }));
    },
    [setVisibleHeaders]
  );
  const onDeleteCallBack = async (Id) => {
    const isFetchData = true;
    await fetchDelete(Id, isFetchData);
  };

  const fetchDelete = async (Id, isFetchData) => {
    setIsLoading(true);
    const httpHandler = new HttpHandler();
    const response = await httpHandler.delete(`${TRANSFERSUBHEADER}/${Id}`);

    if (response.status === 200 || response.status === 204) {
      if (isFetchData) fetchData();
    }
    setIsLoading(false);
  };
  const handleCardEvent = (TransferHeaderID, Id) => {
    setSelectedCardId((prevSelectedCardId) =>
      prevSelectedCardId === TransferHeaderID ? null : TransferHeaderID
    );

    setCardStates((prevStates) => {
      return prevStates.map((innercard) => ({
        ...innercard,
        isSelected: innercard.id === TransferHeaderID ? !innercard.isSelected : false
      }));
    });
    if (Id) {
      fetchCardData(Id, TransferHeaderID);
    }
  };
  const handleChangeStep = (TransferTypeID, Id) => {
    console.log(TransferTypeID, 'TransferTypeID in handleChangeStep');
    const isFetchData = false;

    //if (Id) fetchDelete(Id, isFetchData);
    if (TransferTypeID == 1) {
      dispatch(updateStepByEnum(1));
      dispatch(updateCurrentStep(2));
    } else if (TransferTypeID == 2) {
      dispatch(updateStepByEnum(2));
      dispatch(updateCurrentStep(2));
    } else if (TransferTypeID == 3) {
      dispatch(updateStepByEnum(3));
      dispatch(updateCurrentStep(2));
    }

    handleNavigationToStepOne();
  };

  const handleNavigationToStepOne = () => {
    navigate({ pathname: '/New-Transfers' });
  };

  const mapInfoToSpans = (info) => {
    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    };

    const infoEntries = Object.entries(info);
    const chunkedEntries = chunkArray(infoEntries, 10);
    setIsLoading(false);
    return chunkedEntries.map((chunk, index) => (
      <div key={index} className={styles.infoRow}>
        {chunk.map(([key, value]) => (
          <span key={key} className={styles.infoItem}>
            <strong>{key}:</strong> {value}
          </span>
        ))}
      </div>
    ));
  };
  const isNullOrEmptyOrUndefined = (value) => {
    return value === null || value === undefined || value === '';
  };
  const generateTransferCards2 = () => {
    return cardTypeAndCountFromServer.map((card, index) => {
      const { TransferTypeID, TransferHeaderID, Id } = card;
      const isSelected = selectedCardId === TransferHeaderID;

      const shouldShowChildren = selectedCardId === TransferHeaderID;
      switch (TransferTypeID) {
        case 1:
          return (
            <>
              <TransferCard
                key={`StorageToTrade-${index}`}
                keys={TransferHeaderID}
                padding={false}
                menuButtonfunc={null}
                texthidden={true}
                MenuButtonText={'StorageToTrade'}
                fromIcon={styles.StorageIcon}
                toIcon={styles.TradeIcon}
                changeBgColor={isSelected}
                isCard={true}
                id={Id}
                ChangeStep={() => handleChangeStep(TransferTypeID, Id)}
                onClick={() => handleCardEvent(TransferHeaderID, Id)}
                fromText="Storage"
                toText="Trade"
                hidden={false}
                onDeleteCallBack={onDeleteCallBack}
                hoverEffect={false}
                CardId={TransferHeaderID}
                selectedCardId={selectedCardId}
                data={card}
                childrens={
                  shouldShowChildren && (
                    <div className={`${styles.CardWrapperData}`}>
                      {console.log(vesselElement, 'vesselElement')}
                      {vesselElement && vesselElement != null && vesselElement.length > 0 && (
                        <StyledWrapperTransfer
                          headerIconAlt={'arrow-down'}
                          headerTitle={'Trade Info'}
                          color={'pink'}
                          hasAddButton={false}
                          key={`${'TradeToStorage'}-${index}-WrapperTrade`}
                          hasToolsBoxItems={false}
                          isNew={false}
                          onClickCallBack={() => handleHeaderClick(Id + 'WrapperTrade')}
                          isVisible={!!visibleHeaders[Id + 'WrapperTrade']}>
                          <div className={styles.container}> {vesselElement}</div>
                          {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListTrade}
                      /> */}
                          <AdvanceFormGenerator
                            initialValues={initialValues}
                            formItems={formItems()}
                            hasPermissionContext={true}
                            form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                            discardApiAddress={TRANSFERDETAIL}
                          />
                        </StyledWrapperTransfer>
                      )}

                      {console.log(tradeElement, 'tradeElement')}
                      {tradeElement && tradeElement != null && tradeElement.length > 0 && (
                        <StyledWrapperTransfer
                          headerIconAlt={'arrow-down'}
                          headerTitle={'Vessel Info'}
                          color={'blue'}
                          hasAddButton={false}
                          key={`${'TradeToStorage'}-${index}-WrapperVessel`}
                          hasToolsBoxItems={false}
                          isNew={false}
                          onClickCallBack={() => handleHeaderClick(Id + 'WrapperVessel')}
                          isVisible={!!visibleHeaders[Id + 'WrapperVessel']}>
                          <div className={styles.container}>{tradeElement}</div>
                          {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListVessel}
                      /> */}
                          <AdvanceFormGenerator
                            initialValues={initialValues}
                            formItems={formItemsVessel()}
                            hasPermissionContext={true}
                            form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                            discardApiAddress={TRANSFERDETAIL}
                          />
                        </StyledWrapperTransfer>
                      )}
                    </div>
                  )
                }
              />
            </>
          );
        case 2:
          return (
            <TransferCard
              key={`TradeToStorage-${index}`}
              keys={TransferHeaderID}
              padding={false}
              menuButtonfunc={null}
              texthidden={true}
              MenuButtonText={'TradeToStorage'}
              fromIcon={styles.TradeIcon}
              toIcon={styles.StorageIcon}
              changeBgColor={isSelected}
              isCard={true}
              id={Id}
              onClick={() => handleCardEvent(TransferHeaderID, Id)}
              fromText="Trade"
              toText="Storage"
              hoverEffect={false}
              onDeleteCallBack={onDeleteCallBack}
              hidden={false}
              CardId={TransferHeaderID}
              selectedCardId={selectedCardId}
              ChangeStep={() => handleChangeStep(TransferTypeID, Id)}
              data={card}
              childrens={
                shouldShowChildren && (
                  <div className={`${styles.CardWrapperData}`}>
                    {console.log(vesselElement, 'vesselElement')}
                    {vesselElement && vesselElement != null && vesselElement.length > 0 && (
                      <StyledWrapperTransfer
                        headerIconAlt={'arrow-down'}
                        headerTitle={'Vessel Info'}
                        color={'blue'}
                        hasAddButton={false}
                        key={`${'TradeToStorage'}-${index}-WrapperVessel`}
                        hasToolsBoxItems={false}
                        isNew={false}
                        onClickCallBack={() => handleHeaderClick(Id + 'WrapperVessel')}
                        isVisible={!!visibleHeaders[Id + 'WrapperVessel']}>
                        <div className={styles.container}>{vesselElement}</div>
                        {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListVessel}
                      /> */}
                        <AdvanceFormGenerator
                          initialValues={initialValues}
                          formItems={formItemsVessel()}
                          hasPermissionContext={true}
                          form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                          discardApiAddress={TRANSFERDETAIL}
                        />
                      </StyledWrapperTransfer>
                    )}

                    {console.log(tradeElement, 'tradeElement')}
                    {tradeElement && tradeElement != null && tradeElement.length > 0 && (
                      <StyledWrapperTransfer
                        headerIconAlt={'arrow-down'}
                        headerTitle={'Trade Info'}
                        color={'pink'}
                        hasAddButton={false}
                        key={`${'TradeToStorage'}-${index}-WrapperTrade`}
                        hasToolsBoxItems={false}
                        isNew={false}
                        onClickCallBack={() => handleHeaderClick(Id + 'WrapperTrade')}
                        isVisible={!!visibleHeaders[Id + 'WrapperTrade']}>
                        <div className={styles.container}> {tradeElement}</div>
                        {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListTrade}
                      /> */}
                        <AdvanceFormGenerator
                          initialValues={initialValues}
                          formItems={formItems()}
                          hasPermissionContext={true}
                          form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                          discardApiAddress={TRANSFERDETAIL}
                        />
                      </StyledWrapperTransfer>
                    )}
                  </div> //getTransferVesselToolsBox,,formItemsVessel
                )
              }
            />
          );
        case 3:
          return (
            <TransferCard
              key={`${'StorageToStorage'}-${index}`}
              keys={TransferHeaderID}
              padding={false}
              hidden={false}
              texthidden={true}
              fromIcon={styles.StorageIcon}
              toIcon={styles.StorageIcon}
              changeBgColor={isSelected}
              menuButtonfunc={null}
              isCard={true}
              ChangeStep={() => handleChangeStep(TransferTypeID, Id)}
              id={Id}
              hoverEffect={false}
              MenuButtonText={'StorageToStorage'}
              onClick={() => handleCardEvent(TransferHeaderID, Id)}
              fromText="Storage"
              onDeleteCallBack={onDeleteCallBack}
              toText="Storage"
              CardId={TransferHeaderID}
              selectedCardId={selectedCardId}
              data={card}
              childrens={
                shouldShowChildren && (
                  <div className={`${styles.CardWrapperData}`}>
                    {vesselElement && vesselElement != null && vesselElement.length > 0 && (
                      <StyledWrapperTransfer
                        headerIconAlt={'arrow-down'}
                        headerTitle={'Trade Info'}
                        color={'pink'}
                        hasAddButton={false}
                        key={`${'TradeToStorage'}-${index}-WrapperTrade`}
                        hasToolsBoxItems={false}
                        isNew={false}
                        onClickCallBack={() => handleHeaderClick(Id + 'WrapperTrade')}
                        isVisible={!!visibleHeaders[Id + 'WrapperTrade']}>
                        <div className={styles.container}> {vesselElement}</div>
                        {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListTrade}
                      /> */}
                        <AdvanceFormGenerator
                          initialValues={initialValues}
                          formItems={formItems()}
                          hasPermissionContext={true}
                          form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                          discardApiAddress={TRANSFERDETAIL}
                        />
                      </StyledWrapperTransfer>
                    )}
                    {tradeElement && tradeElement != null && tradeElement.length > 0 && (
                      <StyledWrapperTransfer
                        headerIconAlt={'arrow-down'}
                        headerTitle={'Vessel Info'}
                        color={'blue'}
                        hasAddButton={false}
                        key={`${'TradeToStorage'}-${index}-WrapperVessel`}
                        hasToolsBoxItems={false}
                        isNew={false}
                        onClickCallBack={() => handleHeaderClick(Id + 'WrapperVessel')}
                        isVisible={!!visibleHeaders[Id + 'WrapperVessel']}>
                        <div className={styles.container}>{tradeElement}</div>
                        {/* <ToolsBox
                        toolsBoxName={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                        toolsItemList={toolsItemListVessel}
                      /> */}
                        <AdvanceFormGenerator
                          initialValues={initialValues}
                          formItems={formItemsVessel()}
                          hasPermissionContext={true}
                          form={TRANSFER_DETAIL_SCREEN_COLUMN_STATE_NAME}
                          discardApiAddress={TRANSFERDETAIL}
                        />
                      </StyledWrapperTransfer>
                    )}
                  </div>
                )
              }
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className={`${styles.dFlexColumn} `}>
      {isShowAlert && <Alert key={8826} description={description} />}
      {isLoading && <Loading />}
      <h1 style={{ marginLeft: '10px', marginTop: '10px' }}>
        <span>Transfer</span> <span>#14025523</span>
      </h1>
      <div className={`${styles.flexwrap} `}>
        {Array.isArray(dataCardStepTwo) && Array.isArray(dataCardStepThree) ? (
          generateTransferCards2()
        ) : (
          <div className="height-100 grid-section-container visible">
            <Loading />
          </div>
        )}
        <div>
          <button
            key={100}
            onClick={handleAddCard}
            className={`${styles.Blue} ${styles.ButtonType}`}>
            <span className={`${styles.AddIcon}`}></span>
            Add Type
          </button>
        </div>
      </div>

      <GridDetailWrapper
        navigationProps={{ addressAPI: ADDRESS_TYPE, formName: gridProps?.ColumnStateName }}
        LeftSideComponent={<div>your main component</div>}
        fixedDetailTitle={'ADDRESS_TYPE_ENTRY_SCREEN'}
        RightSideComponent={<div>heloo worlds</div>}
        ColumnStateName={gridProps?.ColumnStateName}
        apiAddress={ADDRESS_TYPE}
        hasDetailSidebar={true}
        isModalFullScreen={true}
        hasCrudOnDetail={true}
        showHeader={true}
        hasGrid={false}
        masterId={1}
        sidebarTabItems={tabItems}
        isMasterDetail={true}
      />

      {/* <GridDetailWrapper
        navigationProps={{
          addressAPI: TRANSFERDETAIL,
          formName: TRANSFER_SCREEN_COLUMN_STATE_NAME
        }}
        LeftSideComponent={<div>h12</div>}
        fixedDetailTitle={'NEW TRANSFER'}
        RightSideComponent={
          <TransferDetails gridRef={gridRef} currentTab={current} currentRow={currentRow} />
        } //"Your sidebar component (e.g,<AddressTypeDetails gridRef={gridRef})" />
        ColumnStateName={TRANSFER_SCREEN_COLUMN_STATE_NAME}
        apiAddress={TRANSFERDETAIL}
        hasDetailSidebar={true}
        isModalFullScreen={true}
        hasCrudOnDetail={true}
        hasGrid={true}
        showHeader={false}
      /> */}
    </div>
  );
}
