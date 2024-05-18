import { useContext, useEffect, useState } from "react";
import AccountContext from "../context/AccountContext";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import config from "../config";
import forge, { random } from 'node-forge';
import { decryptMessage, encryptMessage, parseJSONResponse, parseResponse } from "../pieces/supportFuns";
import ExposeData from "./ExposeData";
import { Exam } from "../pieces/Realm.types";

const ReadExam = ({ password }: { password: string }) => {
    const [examId, setExamId] = useState<string>("")
    const { address } = useContext(AccountContext)

    // Content for Exam
    const [examen, setExamen] = useState<Exam>({ title: "", description: "", applicantString: "", hashAES: "", questions: "" })

    // Encrypted Content
    const [encryptedExamen, setEncryptedExamen] = useState<Exam>({ title: "", description: "", applicantString: "", hashAES: "", questions: "" })

    // Input by user
    const [salt, setSalt] = useState<string>(password)
    const [wrongSalt, setWrongSalt] = useState<boolean>(false)

    // Decyphers the AES
    function DecryptExam() {
        if (encryptedExamen.hashAES.length != 0 && salt !== "") {
            const md = forge.md.sha256.create();
            md.update(salt);
            const shaString = md.digest().toHex();
            const shaKey = shaString.substring(0, 32);
            const shaIV = shaString.substring(32, 64);

            const randomAES = decryptMessage(
                encryptedExamen.hashAES,
                shaKey,
                shaIV
            );
            const parts = randomAES.split("@")
            if (parts.length > 1) {
                const hashAES = forge.util.hexToBytes(parts[0])
                const ivAES = forge.util.hexToBytes(parts[1])
                setExamen(prev => ({ ...prev, title: decryptMessage(encryptedExamen.title, hashAES, ivAES) }))
                setExamen(prev => ({ ...prev, description: decryptMessage(encryptedExamen.description, hashAES, ivAES) }))
                setExamen(prev => ({ ...prev, questions: decryptMessage(encryptedExamen.questions, hashAES, ivAES) }))
                setWrongSalt(previous => true)
            } else {
                setWrongSalt(previous => false)
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
                const bufferedString = Buffer.from(data!, 'base64').toString();
                const content = parseJSONResponse(bufferedString);
                const examResponse = JSON.parse(content) as Exam;
                setEncryptedExamen(examResponse);
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
            {wrongSalt == true && salt.length > 0 ? <p>Wrong Password!</p> : <></>}
            {examId != "" ? <h3>Exam {examId}</h3> : <></>}
            <ExposeData title={"Title"} encryptedData={encryptedExamen.title} decryptedData={examen.title} />
            <ExposeData title={"Description"} encryptedData={encryptedExamen.description} decryptedData={examen.description} />
            <ExposeData title={"Questions"} encryptedData={encryptedExamen.questions} decryptedData={examen.questions} />
            <hr />
            <h3>Applicants</h3>
            {encryptedExamen.applicantString}
            <br />
            <hr />
        </>
    );
};

export default ReadExam;
