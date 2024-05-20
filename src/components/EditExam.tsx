import { useContext, useEffect, useState } from "react";
import { Exam } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge, { random } from 'node-forge';
import "../style.css"
import { decryptMessage, encryptMessage, parseJSONResponse } from "../pieces/supportFuns";
import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

interface Crypto {
    salt: string,
    randomAES: string
}

const ExamEdit = () => {
    const { address } = useContext(AccountContext)
    const [examId, setExamId] = useState<string>("")
    const [wrongSalt, setWrongSalt] = useState<boolean>(false)

    // Decrypted Exam data
    const [examen, setExamen] = useState<Exam>({} as Exam)
    // Encrypted exam data and new encrypted exam data
    const [encryptedExamen, setEncryptedExamen] = useState<Exam>(examen)
    // Edited content
    const [updatedReadableExamen, setUpdatedExamen] = useState<Exam>({} as Exam)
    // Edited content
    const [updatedEncryptedExamen, setUpdatedEncryptedExamen] = useState<Exam>({} as Exam)
    // Encryption values
    const [cryptoData, setCryptoData] = useState<Crypto>({ salt: "", randomAES: "" })


    function generateKeys() {
        const randomBytesKey = forge.random.getBytesSync(32);
        const randomBytesIV = forge.random.getBytesSync(32);
        const bytesKey = forge.util.createBuffer(randomBytesKey);

        // For storing purposes
        const stringKey = forge.util.bytesToHex(randomBytesKey);
        const stringIV = forge.util.bytesToHex(randomBytesIV);
        const storingAESCombiation = `${stringKey}@${stringIV}`;
        setCryptoData(prevState => ({ ...prevState, randomAES: storingAESCombiation }));
        return
    }

    function encryptRandomAES(salt: string) {
        // salt is SHA256-ed and used both parts to encrypt the randomAES
        const md = forge.md.sha256.create();
        md.update(cryptoData.salt);
        const shaString = md.digest().toHex();
        const shaKey = shaString.substring(0, 32);
        const shaIV = shaString.substring(32, 64);
        const encriptedRandomAES = encryptMessage(
            cryptoData.randomAES,
            shaKey,
            shaIV
        )
        // Then the encrypted content is set
        setExamen(prev => ({ ...prev, hashAES: encriptedRandomAES }));
    }

    useEffect(() => {
        // Función para actualizar todas las variables secuencialmente
        const updateVariablesSequentially = () => {
            generateKeys();
            if (cryptoData.randomAES !== "" && cryptoData.salt !== "") {
                encryptRandomAES(cryptoData.salt);
                const parts = cryptoData.randomAES.split("@");
                const bytesKey = forge.util.hexToBytes(parts[0]);
                const randomBytesIV = forge.util.hexToBytes(parts[1]);
                encrypt(bytesKey, randomBytesIV);
            }
        };
        updateVariablesSequentially();
    }, [cryptoData.salt, updatedReadableExamen])

    function encrypt(Key: string, randomBytesIV: string) {
        setUpdatedEncryptedExamen(prev => ({
            ...prev,
            title: encryptMessage(updatedReadableExamen.title, Key, randomBytesIV),
            description: encryptMessage(updatedReadableExamen.description, Key, randomBytesIV),
            questions: encryptMessage(updatedReadableExamen.questions, Key, randomBytesIV),
        }))
    }

    // Decyphers the AES
    function DecryptExam() {
        if (encryptedExamen.hashAES.length != 0 && cryptoData.salt !== "") {
            const md = forge.md.sha256.create();
            md.update(cryptoData.salt);
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
                setExamen(prev => ({
                    ...prev,
                    title: decryptMessage(encryptedExamen.title, hashAES, ivAES),
                    description: decryptMessage(encryptedExamen.description, hashAES, ivAES),
                    questions: decryptMessage(encryptedExamen.questions, hashAES, ivAES),
                }))
                setWrongSalt(prev => true)
            } else {
                setWrongSalt(prev => false)
            }
        }
    }

    // Calls contract to send updated exam data
    const UpdateExam = async () => {
        if (cryptoData.salt.length === 0) {
            return
        }
        // title verification
        if (updatedReadableExamen.title.length < 5) {
            if (updatedReadableExamen.title.length == 0) {
                setUpdatedEncryptedExamen(prev => ({ ...prev, title: encryptedExamen.title }))
            }
            console.error("Size of title is very short")
            return
        }
        // description verification
        if (updatedReadableExamen.description.length < 5) {
            if (updatedReadableExamen.description.length == 0) {
                setUpdatedEncryptedExamen(prev => ({ ...prev, description: encryptedExamen.description }))
            }
            console.error("Size of description is very short")
        }
        // questions verification
        if (updatedReadableExamen.questions.length < 1) {
            if (updatedReadableExamen.questions.length == 0) {
                setUpdatedEncryptedExamen(prev => ({ ...prev, questions: encryptedExamen.questions }))
            }
            console.error("Size of questions is very short")
        }

        if (address) {
            let response = await AdenaService.sendTransaction(
                [
                    {
                        type: EMessageType.MSG_CALL,
                        value: {
                            caller: address,
                            send: '',
                            pkg_path: config.REALM_PATH,
                            func: 'UpdateExam',
                            args: [
                                encryptedExamen.title,
                                encryptedExamen.description,
                                encryptedExamen.questions,
                                examen.applicantString,
                                encryptedExamen.hashAES,
                            ]
                        }
                    }
                ],
                2000000
            )
            if (response !== null){
                console.log("Update sent!")
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
        <div>
            <br />
            <br />
            <h2>Edit your Exam</h2>
            <label>Enter the Exam Id:
                <input
                    type="text"
                    value={examId}
                    onChange={(e) => setExamId(e.target.value)}
                />
            </label>
            <br />
            <button type="button" onClick={() => ReadExam()}>Request Exam</button>
            <form>
                <label>Encryption password (This password is only responsibility of the creator, and shouldn't be shared):
                    <input
                        type="text"
                        onChange={(e) => setCryptoData(prevState => ({ ...prevState, salt: e.target.value }))}
                    />
                </label>
                <button type="button" onClick={() => { DecryptExam() }}>Decrypt</button>

                <br />
                <hr />
                <div>
                    <h2>Title</h2>
                    <FlexboxGrid>
                        <FlexboxGridItem colspan={12}>
                            <h4>Current</h4>
                            <p>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {examen.title !== "" ? <>{examen.title} ({encryptedExamen.title})</> : <>{encryptedExamen.title}</>}
                                </div>
                            </p>

                        </FlexboxGridItem>
                        <FlexboxGridItem colspan={12}>
                            <h4>Updated</h4>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <input
                                    type="text"
                                    onChange={(e) => setUpdatedExamen(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="New Title"
                                />
                                <p>{updatedEncryptedExamen.title}</p>
                            </div>

                        </FlexboxGridItem>
                    </FlexboxGrid>

                    <h2>Description</h2>
                    <FlexboxGrid>
                        <FlexboxGridItem colspan={12}>
                            <h4>Current</h4>
                            <p>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {examen.description !== "" ? <>{examen.description} ({encryptedExamen.description})</> : <>{encryptedExamen.description}</>}
                                </div>
                            </p>

                        </FlexboxGridItem>
                        <FlexboxGridItem colspan={12}>
                            <h4>Updated</h4>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <input
                                    type="text"
                                    onChange={(e) => setUpdatedExamen(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="New Description"
                                />
                                <p>{updatedEncryptedExamen.description}</p>
                            </div>

                        </FlexboxGridItem>
                    </FlexboxGrid>

                    <h2>Questions</h2>
                    <FlexboxGrid>
                        <FlexboxGridItem colspan={12}>
                            <h4>Current</h4>
                            <p>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {examen.questions !== "" ? <>{examen.questions} ({encryptedExamen.questions})</> : <>{encryptedExamen.questions}</>}
                                </div>
                            </p>

                        </FlexboxGridItem>
                        <FlexboxGridItem colspan={12}>
                            <h4>Updated</h4>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <input
                                    type="text"
                                    onChange={(e) => setUpdatedExamen(prev => ({ ...prev, questions: e.target.value }))}
                                    placeholder="New Questions"
                                />
                                <p>{updatedEncryptedExamen.questions}</p>
                            </div>
                        </FlexboxGridItem>
                    </FlexboxGrid>
                </div>
            </form>
            <hr />
            <br />
            <button type="button" onClick={() => UpdateExam()}>Send Exam</button>

        </div>
    );
};

export default ExamEdit;