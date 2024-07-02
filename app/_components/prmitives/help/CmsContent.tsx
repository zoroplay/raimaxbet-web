import React from "react";

const CmsContent = ({ data }: any) => {
  console.log(data, "conss");
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: data?.body }} />
    </div>
  );
};

export default CmsContent;
