import './App.css';
import React from "react";
import Web3 from "web3";
//import { render } from "react-dom";
import { BigNumber } from "bignumber.js";

import KeeyToken from "./artifacts/contracts/KeeyToken.sol/KeeyToken.json";
import KeeyTokenCrowdsale from "./artifacts/contracts/KeeyTokenCrowdsale.sol/KeeyTokenCrowdsale.json";

const CROWDSALE = "0xA4092b59aE194dF47612532aa6Dca46aE0d26e4f";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: null,
      rate: null,
      balance: null,
      decimals: null,
      left: null,
      amount: 0,
    };

    this.changeAmount = this.changeAmount.bind(this);
    this.buy = this.buy.bind(this);
  }

  componentDidMount() {
    this.web3 = new Web3(Web3.givenProvider);
    this.Crowdsale = new this.web3.eth.Contract(KeeyTokenCrowdsale.abi, CROWDSALE);

    this.Crowdsale.methods.rate().call().then((rate) => {
      this.setState({ rate });
    });

    this.Crowdsale.methods.token().call().then((token) => {
      this.Token = new this.web3.eth.Contract(KeeyToken.abi, token);

      this.Token.methods.symbol().call().then((symbol) => {
        this.setState({ symbol });
      });

      this.Token.methods.decimals().call().then((decimals) => {
        this.setState({ decimals: 10 ** decimals });
      });

      this.Token.methods.balanceOf(CROWDSALE).call().then((left) => {
        this.setState({ left: new BigNumber(left) });
      });

      this.web3.eth.getAccounts()
        .then(([account]) => this.Token.methods.balanceOf(account).call())
        .then(balance => this.setState({ balance: new BigNumber(balance) }));
    });
  }

  getPrice() {
    const { amount, rate } = this.state;
    return amount / rate;
  }

  changeAmount(ev) {
    this.setState({ amount: ev.target.value });
  }


  buy(ev) {
    ev.preventDefault();
    const { decimals } = this.state;
    const value = this.getPrice() * decimals;

    this.web3.eth.getAccounts()
      .then(([from]) => this.Crowdsale.methods.buyTokens(from).send({ value, from }));
  }

  render() {
    let { symbol, balance, amount, decimals, left } = this.state;

    if (!balance || !left) return null;

    return (
        <div>
          <div className='T2'>
        <h1 className="display-4">Buy {symbol}, ERC20 token!</h1>
        <p className="lead">See the source to learn how to setup crowdsale landing page</p>
        <hr className="my-4" />
        </div>
        
        <div class="form-group card w-50 h-150 mx-auto td1">
        <p class="h1">You own: {balance.div(decimals).toString()} {symbol}</p>
        <p>{left.div(decimals).toString()} {symbol} is left for sale</p>
        <form onSubmit={this.buy}>
          <div className="input-group mb-2 w-50 mx-auto  " >
            <input type="number" className="form-control" placeholder={`How many ${symbol}s you need?`} onChange={this.changeAmount} value={amount} min="1" max = "2" required />
            </div>
            <div>
              <button className="btn btn-outline-secondary" disabled={!left} type="submit">
                Pay {this.getPrice()} ETH
              </button>
            </div>
        </form>
        </div>
      </div>
    );
  }
}

export default App;