import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function AccountData({ blockNumber, alchemy, utils }) {
    let { account } = useParams();

    const [balance, setBalance] = useState();

    useEffect(() => {
        if(
            !account
            || balance
        ) {
            return;
        }

        (async function getBalance() {
            setBalance(utils.formatEther(await alchemy.core.getBalance(account)));
        })();

    });

    return <div className="container">
        <Link className="row" to={blockNumber ? `/block/${blockNumber}` : "/"}>
            <div className="col">&lt;&lt;&lt; Back</div>
        </Link>
        <div className="row block-header">
            <b>Account:</b>
            <br/>{account}
        </div>
        <div className="row">
            <div className="col">
                Balance:
            </div>
            <div className="col">
                {balance} ETH
            </div>
        </div>
    </div>;
}

export default AccountData;