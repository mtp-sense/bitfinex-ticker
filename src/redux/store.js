import { createStore } from "redux";
import tickerReducer from "./ticker/tickerReducer";

const store = createStore(tickerReducer);

export default store;
