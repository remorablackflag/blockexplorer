import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function BlockData({ setBlockNumber, alchemy }) {

    let { blockNumber } = useParams();

    blockNumber = parseInt(blockNumber);

    const [blockData, setBlockData] = useState();
    const [opened, setOpened] = useState(-1);

    useEffect(() => {
        if (undefined !== blockData) {
            return;
        }

        (async function getBlockData() {
            setBlockData(await alchemy.core.getBlockWithTransactions(blockNumber));
            setBlockNumber(blockNumber);
        })();
    });

    function txClicked(event, i) {
        event.preventDefault();
        setOpened(opened === i ? -1 : i);
    }

    function getBlockDetailRow(key, value) {
        return <div className="row" key={`bd-${key}`}>
            <div className="col key">{key.toString()}</div>
            <div className="col value">{value.toString()}</div>
        </div>;
    }

    function getBlockDetails() {
        if (!blockData) {
            return "";
        }

        return <div>
            <div className="block-header">Block #{blockData.number}</div>
            {Object.keys(blockData).reduce((a, e) => {
                // TODO filter some keys? ...
                if (["extraData", "transactions", "_difficulty"].includes(e)) {
                    return a;
                }
                a.push(getBlockDetailRow(e, blockData[e]));
                return a;
            }, [])}
        </div>;
    }
    
    function getTransactionDetailRow(key, value, i, j, openIndex) {
        if (["to", "from"].includes(key)) {
            return <div className="row tx-row" key={`tx-drow-${i}${j}`}>
                <div className="col key">{key.toString()}</div>
                <Link className="col value" to={`/account/${value}`}>{null !== value ? value.toString() : ""}</Link>
            </div>;
        }

        return <div className="row tx-row" key={`tx-drow-${i}${j}`}>
            <div className="col key">{key.toString()}</div>
            <div className="col value">{null !== value ? value.toString() : ""}</div>
        </div>;
    }

    function getTransactionDetails(transaction, i, openIndex) {
        return <div className={`row tx-details ${i === openIndex ? "open" : ""}`} onClick={(e) => txClicked(e, i)} key={`tx-row-${i}`}>
            <div className="tx-header">{transaction.hash}</div>
            {i === openIndex
                ? Object.keys(transaction).reduce((a, e, j) => {
                    // TODO filter some keys? ...
                    if (["wait"].includes(e)) {
                        return a;
                    }
                    a.push(getTransactionDetailRow(e, transaction[e], i, j, openIndex));
                    return a;
                    }, [])
                : ""}
        </div>;
    }
    
    function getTransactions() {
        if (
            !blockData
            || !blockData.transactions
        ) {
            return;
        }
        return <div className="row">
            <hr className="tx"/>Transactions: <hr className="txs"/>
            {blockData.transactions.map((e, i) => getTransactionDetails(e, i, opened))};
        </div>;
    }
    
    return <div className="container">
        <Link className="row" to="/">
            <div className="col">&lt;&lt;&lt; Back</div>
        </Link>
        {getBlockDetails()}
        {getTransactions()}
    </div>;
}

export default BlockData;