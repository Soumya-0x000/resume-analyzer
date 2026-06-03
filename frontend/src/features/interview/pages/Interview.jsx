import React from "react";
import { useGetInterviewReportByUserId } from "../services/interview.queries";

const Interview = () => {
    const { data } = useGetInterviewReportByUserId();
    console.log(data)

    return <div></div>;
};

export default Interview;
