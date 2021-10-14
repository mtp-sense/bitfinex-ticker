import "./App.css";

import BitfinexTicker from "./components/BitfinexTicker";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return <div className="App">
     <Provider store={store}>
        <BitfinexTicker />
      </Provider>
  </div>;
}

export default App;
