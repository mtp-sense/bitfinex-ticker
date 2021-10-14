import * as constants from "./constants";
export const saveTickerInfo = (payload) => {
  return {
    type: constants.SAVE_TICKER_INFO,
    payload,
  };
};
