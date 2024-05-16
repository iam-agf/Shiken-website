import { useContext, useEffect, useState } from "react";
import AccountContext from "../context/AccountContext";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import config from "../config";
import forge, { random } from 'node-forge';
import { decryptMessage, encryptMessage } from "../pieces/supportFuns";

const ReadExam = () => {
    const [examId, setExamId] = useState<string>("")
    const { address } = useContext(AccountContext)

    // Content for Exam
    const [examTitle, setExamTitle] = useState<string>("")
    const [examDescription, setExamDescription] = useState<string>("")
    const [examQuestions, setExamQuestions] = useState<string>("")
    const [examApplicants, setExamApplicants] = useState<string>("")

    // Encrypted Content
    const [eTitle, setETitle] = useState<string>("")
    const [eDescription, setEDescription] = useState<string>("")
    const [eQuestions, setEQuestions] = useState<string>("")
    const [eHashAES, setEHashAES] = useState<string>("")

    // Input by user
    const [salt, setSalt] = useState<string>("")

    // Decyphers the AES
    function DecryptExam() {
        if (eHashAES.length != 0 && salt !== "") {
            const md = forge.md.sha256.create();
            md.update(salt);
            const shaString = md.digest().toHex();
            const shaKey = shaString.substring(0, 32);
            const shaIV = shaString.substring(32, 64);

            const randomAES = decryptMessage(
                eHashAES,
                shaKey,
                shaIV
            );
            const parts = randomAES.split("@")
            console.log(randomAES)
            const hashAES = forge.util.hexToBytes(parts[0])
            const ivAES = forge.util.hexToBytes(parts[1])
            if (parts.length != 0) {
                setExamTitle(decryptMessage(eTitle, hashAES, ivAES))
                setEDescription(decryptMessage(eDescription, hashAES, ivAES))
                setEQuestions(decryptMessage(eQuestions, hashAES, ivAES))
            }
        }
    }

    // Calls contract to get exam data
    const ReadExam = async () => {
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
            if (response) {
                const data = response.deliver_tx.ResponseBase.Data
                const content = Buffer.from(data!, 'base64').toString();
                // Remove the (" and the ", string)
                const pureAnswer = content.substring(2, content.length - 9);
                const entries = pureAnswer.split("@");
                if (entries.length != 0) {
                    setETitle(entries[0])
                    setEDescription(entries[1])
                    setEQuestions(entries[2])
                    setExamApplicants(entries[3])
                    setEHashAES(entries[4])
                    console.log({ entries, eTitle, eDescription, eQuestions, eHashAES })
                }
            }
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
            <br />
            <button type="button" onClick={() => ReadExam()}>Request Exam</button>
            <br />
            <hr />
            <h4>Type the key to decrypt</h4>
            <input
                type="text"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
            />
            <button type="button" onClick={() => { DecryptExam() }}>Decrypt</button>
            <br />
            <hr />
            <h3>Title</h3>
            {examTitle !== "" ? <p>{examTitle}</p> : <></>}
            {eTitle}
            <br />
            <hr />
            <h3>Description</h3>
            {examDescription !== "" ? <p>{examDescription}</p> : <></>}
            {eDescription}
            <br />
            <hr />
            <h3>Applicants</h3>
            {examApplicants !== "" ? <p>{examApplicants}</p> : <></>}
            <br />
            <hr />
            <h3>Questions</h3>
            {examQuestions !== "" ? <p>{examQuestions}</p> : <></>}
            {eQuestions}
            <br />
            <hr />
            <h3>Encrypted AES</h3>
            {eHashAES !== "" ? <p>{eHashAES}</p> : <></>}
            <br />
            <hr />

        </>
    );
};

export default ReadExam;
