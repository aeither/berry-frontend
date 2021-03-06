import React from "react";
import "error-polyfill";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.scss";
import * as nearAPI from "near-api-js";
import DiscoverPage from "./Discover";
import HomePage from "./Home";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";
import { fromNear } from "../components/BuyButton";
import ls from "local-storage";
import CardPage from "./Card";
import AccountPage from "./Account";
import StatsPage from "./Stats";
import RecentPage from "./Recent";
import { Button, HStack, Box } from "@chakra-ui/react";

const IsMainnet = window.location.hostname === "berry.cards";
const TestNearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  archivalNodeUrl: "https://rpc.testnet.internal.near.org",
  contractName: "dev-1621626423763-23601795253740",
  walletUrl: "https://wallet.testnet.near.org",
};
const MainNearConfig = {
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
  archivalNodeUrl: "https://rpc.mainnet.internal.near.org",
  contractName: "cards.berryclub.ek.near",
  walletUrl: "https://wallet.near.org",
};

const NearConfig = IsMainnet ? MainNearConfig : TestNearConfig;

const FetchLimit = 50;

const mapAccount = (a) => {
  return {
    requests: a.requests,
    numCards: a.num_cards,
    purchaseVolume: fromNear(a.purchase_volume),
    numPurchases: a.num_purchases,
    saleProfit: fromNear(a.sale_profit),
    numSales: a.num_sales,
    numVotes: a.num_votes,
  };
};

class CardsPage extends React.Component {
  constructor(props) {
    super(props);

    this._near = {};

    this._near.lsKey = NearConfig.contractName + ":v01:";
    this._near.lsKeyRecentCards = this._near.lsKey + "recentCards";

    this.state = {
      connected: false,
      isNavCollapsed: true,
      account: null,
      requests: null,
      recentCards: ls.get(this._near.lsKeyRecentCards) || [],
    };

    this._initNear().then(() => {
      this.setState({
        signedIn: !!this._near.accountId,
        signedAccountId: this._near.accountId,
        connected: true,
      });
    });
  }

  async _initNear() {
    const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
    const near = await nearAPI.connect(
      Object.assign({ deps: { keyStore } }, NearConfig)
    );
    this._near.keyStore = keyStore;
    this._near.near = near;

    this._near.walletConnection = new nearAPI.WalletConnection(
      near,
      NearConfig.contractName
    );
    this._near.accountId = this._near.walletConnection.getAccountId();

    this._near.account = this._near.walletConnection.account();
    this._near.contract = new nearAPI.Contract(
      this._near.account,
      NearConfig.contractName,
      {
        viewMethods: [
          "get_account",
          "get_num_accounts",
          "get_accounts",
          "get_num_cards",
          "get_top",
          "get_rating",
          "get_trade_data",
          "get_card_info",
          "get_account_cards",
          "get_recent_cards",
        ],
        changeMethods: ["register_account", "vote", "buy_card"],
      }
    );

    this._near.accounts = {};

    this._near.getAccount = (accountId) => {
      if (accountId in this._near.accounts) {
        return this._near.accounts[accountId];
      }
      return (this._near.accounts[accountId] = Promise.resolve(
        (async () => {
          const a = await this._near.contract.get_account({
            account_id: accountId,
          });
          const account = a ? mapAccount(a) : null;
          if (account) {
            account.fetchCards = () => {
              if (account.cardFetching) {
                return account.cardFetching;
              }
              const promises = [];
              for (let i = 0; i < account.numCards; i += FetchLimit) {
                promises.push(
                  this._near.contract.get_account_cards({
                    account_id: accountId,
                    from_index: i,
                    limit: FetchLimit,
                  })
                );
              }
              return (account.cardFetching = Promise.resolve(
                (async () => {
                  return (await Promise.all(promises)).flat();
                })()
              ));
            };
          }
          return account;
        })()
      ));
    };

    if (this._near.accountId) {
      let account = await this._near.getAccount(this._near.accountId);
      if (account === null) {
        await this._near.contract.register_account();
        delete this._near.accounts[this._near.accountId];
        account = await this._near.getAccount(this._near.accountId);
      }
      this.setState({
        account,
        requests: account.requests,
      });
    }
  }

  async requestSignIn(e) {
    e && e.preventDefault();
    const appTitle = "Berry";
    await this._near.walletConnection.requestSignIn(
      NearConfig.contractName,
      appTitle
    );
    return false;
  }

  async logOut() {
    this._near.walletConnection.signOut();
    this._near.accountId = null;
    this.setState({
      signedIn: !!this._accountId,
      signedAccountId: this._accountId,
    });
  }

  popRequest(c) {
    const requests = this.state.requests.slice(1);
    this.setState(
      {
        requests,
      },
      c
    );
  }

  addRequest(r, c) {
    const requests = this.state.requests.slice(0);
    requests.push(r);
    this.setState(
      {
        requests,
      },
      c
    );
  }

  addRecentCard(cardId) {
    let recentCards = this.state.recentCards.slice(0);
    const index = recentCards.indexOf(cardId);
    if (index !== -1) {
      recentCards.splice(index, 1);
    }
    recentCards.unshift(cardId);
    recentCards = recentCards.slice(0, 5);
    ls.set(this._near.lsKeyRecentCards, recentCards);
    this.setState({
      recentCards,
    });
  }

  async refreshAllowance() {
    alert(
      "You're out of access key allowance. Need sign in again to refresh it"
    );
    await this.logOut();
    await this.requestSignIn();
  }

  render() {
    const passProps = {
      _near: this._near,
      updateState: (s, c) => this.setState(s, c),
      popRequest: (c) => this.popRequest(c),
      addRequest: (r, c) => this.addRequest(r, c),
      addRecentCard: (cardId) => this.addRecentCard(cardId),
      refreshAllowance: () => this.refreshAllowance(),
      ...this.state,
    };
    const header = !this.state.connected ? (
      <div>
        Connecting...{" "}
        <span
          className="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
      </div>
    ) : this.state.signedIn ? (
      <Button
        variant="outline"
        rounded="xl"
        border="2px"
        borderColor="brand.900"
        color="brand.900"
        _hover={{ filter: "brightness(0.5)" }}
        onClick={() => this.logOut()}
      >
        Log out ({this.state.signedAccountId})
      </Button>
    ) : (
      <Button
        variant="solid"
        rounded="xl"
        background="brand.900"
        _hover={{ filter: "brightness(0.8)" }}
        onClick={() => this.requestSignIn()}
      >
        Log in with NEAR Wallet
      </Button>
    );

    return (
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
          <HStack pb="4"  w="100%" justify="space-between" spacing="4">
            <HStack color="brand.100" rounded="xl" background="white" p="2">
              <Link aria-current="page" to="/recent">
                Recent
              </Link>
              {this.state.signedIn && (
                <Link aria-current="page" to="/top">
                  Top
                </Link>
              )}
              {this.state.signedIn && (
                <Link
                  aria-current="page"
                  to={`/a/${this.state.signedAccountId}`}
                >
                  Profile
                </Link>
              )}
              <Link aria-current="page" to="/stats">
                Stats
              </Link>
            </HStack>

            <form className="d-flex">{header}</form>
          </HStack>

          <Switch>
            <Route exact path={"/"}>
              {this.state.signedIn ? (
                <HomePage {...passProps} />
              ) : (
                <DiscoverPage {...passProps} />
              )}
            </Route>
            <Route exact path={"/recent"}>
              <RecentPage {...passProps} />
            </Route>
            <Route exact path={"/top"}>
              <DiscoverPage {...passProps} />
            </Route>
            <Route exact path={"/stats"}>
              <StatsPage {...passProps} />
            </Route>
            <Route exact path={"/a/:accountId"}>
              <AccountPage {...passProps} />
            </Route>
            <Route exact path={"/c/:cardId"}>
              <CardPage {...passProps} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default CardsPage;
