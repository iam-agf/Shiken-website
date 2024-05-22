import { useContext, useEffect, useState } from "react";
import { Exam, Crypto } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge from 'node-forge';
import "../style.css"
import { encryptMessage } from "../pieces/supportFuns";

const ExamForm = () => {
    const { address } = useContext(AccountContext)

    // Exam data
    const [examen, setExamen] = useState<Exam>({} as Exam)

    // Encryption values
    const [cryptoData, setCryptoData] = useState<Crypto>({ salt: "", randomAES: "" })

    // Encrypted exam data
    const [encriptedExamen, setEncriptedExamen] = useState<Exam>({} as Exam)

    function generateKeys() {
        const randomBytesKey = forge.random.getBytesSync(32);
        const randomBytesIV = forge.random.getBytesSync(32);

        // For storing purposes
        const stringKey = forge.util.bytesToHex(randomBytesKey);
        const stringIV = forge.util.bytesToHex(randomBytesIV);
        const storingAESCombiation = `${stringKey}@${stringIV}`;
        setCryptoData(prevState => ({ ...prevState, randomAES: storingAESCombiation }));
        return
    }

    function encryptRandomAES() {
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
        setEncriptedExamen(prev => ({ ...prev, hashAES: encriptedRandomAES }));
    }

    useEffect(() => {
        // Función para actualizar todas las variables secuencialmente
        const updateVariablesSequentially = () => {
            generateKeys();
            if (cryptoData.randomAES !== "" && cryptoData.salt !== "") {
                encryptRandomAES();
                const parts = cryptoData.randomAES.split("@");
                const bytesKey = forge.util.hexToBytes(parts[0]);
                const randomBytesIV = forge.util.hexToBytes(parts[1]);
                encrypt(bytesKey, randomBytesIV);
            }

        };

        // Llama a la función para actualizar todas las variables secuencialmente
        updateVariablesSequentially();
    }, [cryptoData.salt, examen])

    function encrypt(Key: string, randomBytesIV: string) {
        setEncriptedExamen(prev => ({ ...prev, title: encryptMessage(examen.title, Key, randomBytesIV) }));
        setEncriptedExamen(prev => ({ ...prev, description: encryptMessage(examen.description, Key, randomBytesIV) }));
        setEncriptedExamen(prev => ({ ...prev, questions: encryptMessage(examen.questions, Key, randomBytesIV) }));
    }

    const sendExam = async () => {
        if (cryptoData.salt.length === 0) {
            return
        }
        // title verification
        if (examen.title.length < 5) {
            console.error("Size of title is very short")
        }
        // description verification
        if (examen.description.length < 5) {
            console.error("Size of description is very short")
        }

        // questions verification
        if (examen.questions.length < 1) {
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
                            func: 'AddExam',
                            args: [
                                encriptedExamen.title,
                                encriptedExamen.description,
                                encriptedExamen.questions,
                                examen.applicantString,
                                encriptedExamen.hashAES,
                            ]
                        }
                    }
                ],
                2000000
            )
        }
    }

    return (
        <>
            <br />
            <br />
            <h2>Add your Exam</h2>
            <form>
                <label>Encryption password (This password is only responsibility of the creator, and shouldn't be shared):
                    <input
                        type="text"
                        onChange={(e) => setCryptoData(prevState => ({ ...prevState, salt: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Title:
                    <input
                        type="text"
                        value={examen.title}
                        onChange={(e) => setExamen(prev => ({ ...prev, title: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Description:
                    <input
                        type="text"
                        value={examen.description}
                        onChange={(e) => setExamen(prev => ({ ...prev, description: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Questions:
                    <input
                        type="text"
                        value={examen.questions}
                        onChange={(e) => setExamen(prev => ({ ...prev, questions: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Applicants:
                    <input
                        type="text"
                        value={examen.applicantString}
                        onChange={(e) => setExamen(prev => ({ ...prev, applicantString: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <button type="button" onClick={sendExam}>
                    Send Exam
                </button>
            </form>
            <br />
            <div>
                <h2>You're sending</h2>
                <hr />
                <h4>Title: </h4>
                <p>{encriptedExamen.title}</p>
                <br />
                <hr />
                <h4>Description: </h4>
                <p>{encriptedExamen.description}</p>
                <br />
                <hr />
                <h4>Questions:</h4>
                <p>{encriptedExamen.questions}</p>
                <br />
                <hr />
                <h4>Applicants:</h4>
                <p>{examen.applicantString}</p>
                <br />
                <hr />
                <h4>Encrypted AES hash:</h4>
                <p>{encriptedExamen.hashAES}</p>
                <br />
                <hr />
            </div>
        </>
    );
};

export default ExamForm;
