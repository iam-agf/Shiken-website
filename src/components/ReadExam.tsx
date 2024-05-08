import { useContext, useState } from "react";
import AccountContext from "../context/AccountContext";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import config from "../config";

const ReadExam = () => {
    const [examId, setExamId] = useState<string>("")
    const { address } = useContext(AccountContext)
    const ReadExam = async () => {
        console.log(address)
        if (address) {
            let response = await AdenaService.sendTransaction(
                [
                    {
                        type: EMessageType.MSG_CALL,
                        value: {
                            caller: address,
                            send: '',
                            pkg_path: config.REALM_PATH,
                            func: 'ReadExam',
                            args: [
                                examId
                            ]
                        }
                    }
                ],
                2000000
            )
            console.log(response)
        }

    }
    return (
        <>
            <label>Enter the Exam Id:
                <input
                    type="text"
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                />
            </label>
            <br/>
            <button type="button" onClick={() => ReadExam()}>Request Exam</button>

        </>
    );
};

export default ReadExam;
