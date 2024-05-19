import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import AccountContext from "../context/AccountContext";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import { createIconFont } from '@rsuite/icons';
import { parseResponse } from "../pieces/supportFuns";
import ProviderContext from "../context/ProviderContext";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import config from "../config";

const IconFont = createIconFont({
    scriptUrl: '//at.alicdn.com/t/font_2144422_r174s9i1orl.js'
});
const PageMyData = () => {
    const { address } = useContext(AccountContext)
    const { provider } = useContext(ProviderContext);

    const [numberPendingExams, setNumberPendingExams] = useState<string | null>(null);
    const [examIds, setExamIds] = useState<string[]>([]);

    useEffect(() => {
        if (provider !== null && address !== "") {
            const fetchData = async () => {
                console.log(200, provider, address, provider && address != null)
                if (provider && address != null) {
                    provider.evaluateExpression('gno.land/r/dev/shikenrepository', `GetPendingExams("${address}")`)
                        .then((pExams: any) => parseResponse(pExams))
                        .then((data: any) => {
                            setExamIds(JSON.parse(data));
                            console.log({ data, examIds })
                        })
                        .catch((error: any) => console.log(error));
                    provider.evaluateExpression('gno.land/r/dev/shikenrepository', `GetNumberPendingExams("${address}")`)
                        .then((pExams: any) => parseResponse(pExams))
                        .then((data: any) => setNumberPendingExams(data))
                        .catch((error: any) => console.log(error));
                };
            };
            fetchData();
        }
    }, [provider, address]);

    const DropExam = async (examId: string) => {

        if (address) {
            let response = await AdenaService.sendTransaction(
                [
                    {
                        type: EMessageType.MSG_CALL,
                        value: {
                            caller: address,
                            send: '',
                            pkg_path: config.REALM_PATH,
                            func: 'DropExam',
                            args: [
                                examId
                            ]
                        }
                    }
                ],
                2000000
            )
            if (response) {
                const data = response.deliver_tx.ResponseBase.Data
                const bufferedString = Buffer.from(data!, 'base64').toString();
                console.log(bufferedString)
            }
        }
    }


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
                        <p>You have {numberPendingExams} exams pending:</p>
                        {examIds.length > 0 ? examIds.map((examId, _) => (
                            <>
                                <li>
                                    <button type="button" onClick={() => DropExam(examId.toString())}>Drop Exam {examId}</button>
                                </li>
                                <br />
                            </>

                        )) : <></>}
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
