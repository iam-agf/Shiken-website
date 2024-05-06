import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import AccountContext from "../context/AccountContext";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { createIconFont } from '@rsuite/icons';
import { parseResponse } from "../pieces/supportFuns";
import ProviderContext from "../context/ProviderContext";

const IconFont = createIconFont({
    scriptUrl: '//at.alicdn.com/t/font_2144422_r174s9i1orl.js'
});
const PageMyData = () => {
    const { address } = useContext(AccountContext)
    const { provider } = useContext(ProviderContext);

    const [pendingExams, setPendingExams] = useState<string | null>(null);

    useEffect(() => {
        if (provider && address) {
            const fetchData = async () => {
                console.log(200, provider, address, provider && address != null)
                if (provider && address != null) {
                    provider.evaluateExpression('gno.land/r/dev/shikenrepository', `GetMyPendingExams("${address}")`)
                        .then((pExams: any) => parseResponse(pExams))
                        .then((data: any) => setPendingExams(data))
                        .catch((error: any) => console.log(error));
                };
            };
            fetchData();
        }
    }, [provider, address]);

    console.log(pendingExams);

    return (
        <>
            <Header />
            <FlexboxGrid>
                <FlexboxGridItem colspan={4} />
                <FlexboxGridItem colspan={10}>
                    <div>
                        <h3><IconFont icon="rs-iconmember" /> Your address</h3>
                        <p>  {address}</p>
                    </div>
                    <div>
                        <h3><IconFont icon="rs-iconnotice" /> Your Pending exams</h3>
                        <p>You have {pendingExams} exams pending</p>
                        <p>Their ids are </p>
                    </div>

                </FlexboxGridItem>
                <FlexboxGridItem colspan={10}>
                </FlexboxGridItem>
                <FlexboxGridItem colspan={4} />
            </FlexboxGrid>
        </>
    );
};

export default PageMyData;
