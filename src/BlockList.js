import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function BlockList({ blockNumber, page, setPage, alchemy }) {

    const [latestBlockNumber, setLatestBlockNumber] = useState(0);
    // @TODO change page size ?
    const [blocksPerPage /** , setBlocksPerPage */] = useState(10);

    useEffect(() => {
        if (0 < latestBlockNumber) {
            return;
        } 

        (async function getBlockNumber() {

            const number = parseInt(await alchemy.core.getBlockNumber());

            let latest = number - (blocksPerPage * page);
            let last = latest  - blocksPerPage;
            let pageShift = 0;
    
            // shift pages as incoming blocks might have pushed the last selected block to another page
            while(
                blockNumber !== 0
                && blockNumber < last
            ) {
                latest -= blocksPerPage;
                last -= blocksPerPage;
                pageShift++;
            }

            if (pageShift) {
                setPage(page + pageShift);
            }

            setLatestBlockNumber(number);
            
        })();
    });

    function prevPage(e) {
        e.preventDefault();
        setPage(page ? page - 1 : 0);
    }

    function nextPage(e) {
        e.preventDefault();
        setPage(page < Number.MAX_SAFE_INTEGER ? page + 1 : page);
    }

    function generateBlockList() {
        if (!latestBlockNumber) {
            return "";
        }

        const list = [];
        let latest = latestBlockNumber - (blocksPerPage * page);
        let last = latest  - blocksPerPage;

        for(let i = latest; last <= i; i-- ) {
            list.push(<Link to={`/block/${i}`} className={`row blk-row ${blockNumber === i ? "open" : ""}`} key={`blk-${i}`}>
                <div className="col">
                    #{i}
                </div>
            </Link>);
        }

        return list;
    };

    return <div className="container">
        <div className="row block-header">
            <b>Blocks</b>
            <br/>(latest: #{latestBlockNumber})
        </div>
        {generateBlockList()}
        <div className="row">
            <div className="col">
                <button onClick={prevPage} disabled={page === 0 ? true : ""}>&lt;&lt;&lt;</button>
            </div>
            <div className="col">
                Page: {page + 1}
            </div>
            <div className="col">
                <button onClick={nextPage}>&gt;&gt;&gt;</button>
            </div>
        </div>
    </div>;
}

export default BlockList;