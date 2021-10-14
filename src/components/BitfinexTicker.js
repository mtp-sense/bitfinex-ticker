import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import * as TickerActions from "../redux/ticker/tickerActions";
import { FaBtc, FaCaretDown, FaCaretUp } from "react-icons/fa";

let data;

function commaSeparatedNum(num) {
  num = num.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(num)) num = num.replace(pattern, "$1,$2");
  return num;
}

function BitfinexTicker(props) {
  let cMessage = document.querySelector(".connection-closed-message");
  const wsRef = useRef();
  const [isConnected, setIsConnected] = useState(true);

  const { ticker } = props;

  const empty_ticker = [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  const [
    CHANNEL_ID,
    [
      BID,
      BID_SIZE,
      ASK,
      ASK_SIZE,
      DAILY_CHANGE,
      DAILY_CHANGE_PERC,
      LAST_PRICE,
      VOLUME,
      HIGH,
      LOW,
    ],
  ] = Array.isArray(ticker) ? ticker : empty_ticker;

  //Connect button handler
  const connect = () => {
    console.log("Connect btn clicked");
    cMessage.style.display = "none";
    setIsConnected(true);
  };

  //Disconnect button handler
  const disconnect = () => {
    console.log("Disconnect btn clicked");
    cMessage.style.display = "block";
    setIsConnected(false);
  };

  useEffect(() => {
    //Create a new websocket connection at the beginning of the communcation and also after reconnecting
    if (!wsRef.current || wsRef.current.readyState === 3) {
      wsRef.current = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    }
    if (!isConnected) {
      wsRef.current.close();
      return;
    }

    let channels = {};

    wsRef.current.onopen = function () {
      console.log("Connected");
      setIsConnected(true);

      wsRef.current.send(
        JSON.stringify({
          event: "subscribe",
          channel: "ticker",
          symbol: "tBTCUSD",
        })
      );
    };

    wsRef.current.onmessage = function incoming(messageEvent) {
      data = messageEvent.data;

      data = JSON.parse(data);

      if (data.event === "subscribed") {
        channels[data.channel] = data.chanId;
      }
      if (data[0] === channels["ticker"]) {
        Array.isArray(data[1]) && props.saveTickerInfo(data);
      }
    };

    wsRef.current.onclose = function close() {
      console.log("Connection closed");
      setIsConnected(false);
    };
  }, [isConnected]);

  return (
    <div className="ticker-wrapper">
      <div>
        <h2 align="center">BitFinex Ticker</h2>
        <div className="container" align="center">
          <div className="ticker-icon">
            <div className="bit-coin-icon">
              <FaBtc />
            </div>
          </div>
          <div className="ticker-items">
            <span align="left">
              BTC<span className="gray-text">/</span>
              USD
            </span>
            <div align="left">
              <span className="gray-text">VOL</span>{" "}
              {VOLUME && commaSeparatedNum(VOLUME.toFixed(2))}{" "}
              <u className="gray-text">BTC</u>
            </div>
            <div align="left">
              <span className="gray-text">LOW</span>{" "}
              {LOW && commaSeparatedNum(LOW.toFixed(2))}
            </div>
          </div>

          <div className="ticker-items">
            <span align="right">
              {LAST_PRICE && commaSeparatedNum(LAST_PRICE.toFixed(2))}
            </span>

            <div align="right">
              <span
                className={
                  DAILY_CHANGE_PERC < 0 ? `bfx-red-text` : "bfx-green-text"
                }
              >
                {DAILY_CHANGE &&
                  commaSeparatedNum(Math.abs(DAILY_CHANGE).toFixed(2))}
                {DAILY_CHANGE_PERC < 0 ? <FaCaretDown /> : <FaCaretUp />}(
                {Math.abs((DAILY_CHANGE_PERC * 100).toFixed(2))}%)
              </span>
            </div>
            <div align="right">
              <span className="gray-text">HIGH</span>{" "}
              {HIGH && commaSeparatedNum(HIGH.toFixed(2))}
            </div>
          </div>
        </div>
        <div align="center" className="button-container">
          <button className="btn" onClick={connect}>
            Connect
          </button>
          <button className="btn btn-disconnect" onClick={disconnect}>
            Disconnect
          </button>
        </div>
        <div align="center" className="connection-closed-message gray-text">
          Connection is closed, please click on Connect button for reconnecting
          to view the data.
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  console.log("state");
  console.log(state);
  return {
    ticker: state,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    saveTickerInfo: (data) => dispatch(TickerActions.saveTickerInfo(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BitfinexTicker);
