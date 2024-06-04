import React from "react";
import TradeToStorage from "../TradeToStorage/TradeToStorage";
import TradeToStorageGrid from "../TradeToStorage/TradeToStorageGrid";
import TradeToStorageList from "../TradeToStorage/TradeToStorageList";
import StorageToTradeGrid from "../StorageToTrade/StorageToTradeGrid";
import StorageToTradeList from "../StorageToTrade/StorageToTradeList";
import StorageToStorageGrid from "../StorageToStorage/StorageToStorageGrid";
import StorageToStorageList from "../StorageToStorage/StorageToStorageList";
// import ReviewRFIDTags from "views/Inventory/Rentals/ImportRFIDTags/ReviewRFIDTags";
// import ViewImportedRFIDTags from "views/Inventory/Rentals/ImportRFIDTags/ViewImportedRFIDTags";
// import ImportRFIDTagsStep from "./ImportRFIDTagsStep";

export const stepContentsTradeToStorage = () => {
  return [
    {
      key: 0,
      component: <TradeToStorage />,
    },
    {
      key: 1,
      component:  <StorageToTradeGrid />,
    },
    {
      key: 2,
      component: <StorageToTradeList />,
    },
  ];
};


export const secondStepContentsTradeToStorage = () => {
  return [
    {
      key: 0,
      component: <TradeToStorage />,
    },
    {
      key: 1,
      component: <TradeToStorageGrid />,
    },
    {
      key: 2,
      component: <TradeToStorageList />,
    },
  ];
};

export const ThreeStepContentsTradeToStorage = () => {
  return [
    {
      key: 0,
      component: <TradeToStorage />,
    },
    {
      key: 1,
      component: <StorageToStorageGrid />,
    },
    {
      key: 2,
      component: <StorageToStorageList />,
    },
  ];
};
