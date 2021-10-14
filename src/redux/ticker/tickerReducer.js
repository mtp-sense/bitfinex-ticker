import * as constants from "./constants";

const initial_state = null;

function tickerReducer(state = initial_state, action) {
  console.log(action);
  switch (action.type) {
    case constants.SAVE_TICKER_INFO:
      return [...action.payload];
    default:
      return state;
  }
}
export default tickerReducer;
