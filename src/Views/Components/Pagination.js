import React, {useEffect, useState} from "react";

export default function Pagination({data, offset, changePage, colspan}) {
    const [pagesNumber, setPagesNumber] = useState([]);

    const getNumbers = (data) => {
        if (!data.to) {
            return [];
        }
        let from = data.current_page - offset;
        if (from < 1) {
            from = 1;
        }
        let to = from + (offset * 2);
        if (to >= data.last_page) {
            to = data.last_page;
        }
        let pagesArray = [];
        for (from = 1; from <= to; from++) {
            pagesArray.push(from);
        }
        setPagesNumber(pagesArray);
    }

    useEffect(() => {
        if (data) {
            getNumbers(data);
        }
    }, [data]);

    // console.log('pagination'data);
    // console.log('pages number', data);

    return (
        <tr className="dgPagerStyle">
            <td colSpan={colspan}>
                <table border="0">
                    <tbody>
                    <tr>
                        <td>

                        </td>
                        {pagesNumber.map((page, i) =>
                        <td key={i}>
                            {page === data.current_page ? (
                                <span>{page}</span>
                            ):(
                                <a href="javascript:;" onClick={() => changePage(page)}>{page}</a>
                            )}
                        </td>
                        )}
                    </tr>
                    </tbody>
                </table>
                <div align="right">Number of rows: {data.total}</div>
            </td>
        </tr>
    )
}
