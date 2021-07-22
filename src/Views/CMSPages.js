import React from "react";
import useSWR from "swr/esm/use-swr";

export default function CMSPages({match}) {
    const slug = match.params.slug;

    const {data, error} = useSWR(`/utilities/cms/page/${slug}`);

    return (
        <>
            <div id="MainContent" className="sport" style={{padding: '10px'}}>
                <h2>{data?.title}</h2>
                <div  dangerouslySetInnerHTML={{ __html: data?.body}} />
            </div>
        </>
    )
}
