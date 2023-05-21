import { Alchemy, Network, Utils } from "alchemy-sdk";
import { useState } from "react";
import { Switch, Route } from "react-router-dom";

import BlockList from "./BlockList.js";
import BlockData from "./BlockData.js";
import AccountData from "./AccountData.js";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {

    const [blockNumber, setBlockNumber] = useState(0);
    const [page, setPage] = useState(0);

    return <div className="App">
        <Switch>
            <Route path="/block/:blockNumber">
                <BlockData
                    setBlockNumber={setBlockNumber}
                    alchemy={alchemy}
                />
            </Route>
            <Route path="/account/:account">
                <AccountData
                    blockNumber={blockNumber}
                    alchemy={alchemy}
                    utils={Utils}
                />
            </Route>
            <Route path="*">
                <BlockList
                    blockNumber={blockNumber}
                    page={page}
                    setPage={setPage}
                    alchemy={alchemy}
                />
            </Route>
        </Switch>
    </div>;
}

export default App;
