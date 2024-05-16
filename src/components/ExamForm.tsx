import { useContext, useEffect, useState } from "react";
import { Exam } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge, { random } from 'node-forge';
import "../style.css"
import { decryptMessage, encryptMessage } from "../pieces/supportFuns";

interface Crypto {
    salt: string,
    randomAES: string
}

const ExamForm = () => {
    const { address } = useContext(AccountContext)

    // Exam data
    const [title, setTitle] = useState<string>("")
    const [questions, setQuestions] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [applicantString, setApplicantString] = useState<string>("")

    // Encryption values
    const [cryptoData, setCryptoData] = useState<Crypto>({ salt: "", randomAES: "" })

    // Encrypted exam data
    const [eTitle, setETitle] = useState<string>(title)
    const [eQuestions, setEQuestions] = useState<string>(questions)
    const [eDescription, setEDescription] = useState<string>(description)
    const [eHashAES, setEHashAES] = useState<string>(applicantString)

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
        setEHashAES(encriptedRandomAES);
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

        // Llama a la función para actualizar todas las variables secuencialmente
        updateVariablesSequentially();
    }, [cryptoData.salt, title, questions, description])

    function encrypt(Key: string, randomBytesIV: string) {
        const eT = setETitle(encryptMessage(title, Key, randomBytesIV));
        const eD = setEDescription(encryptMessage(description, Key, randomBytesIV));
        const eQ = setEQuestions(encryptMessage(questions, Key, randomBytesIV));
    }

    const sendExam = async () => {
        if (cryptoData.salt.length === 0) {
            return
        }
        let e: Exam = {
            title: "",
            description: "",
            applicantString: "",
            questions: "",
        }
        // title verification
        if (title.length < 5) {
            console.error("Size of title is very short")
        } else {
            e.title = title
        }

        // description verification
        if (description.length < 5) {
            console.error("Size of description is very short")
        } else {
            e.description = description
        }

        // questions verification
        if (questions.length < 1) {
            console.error("Size of questions is very short")
        } else {
            e.questions = questions
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
                                eTitle,
                                eDescription,
                                eQuestions,
                                applicantString,
                                eHashAES
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Description:
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Questions:
                    <input
                        type="text"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Applicants:
                    <input
                        type="text"
                        value={applicantString}
                        onChange={(e) => setApplicantString(e.target.value)}
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
                <p>{eTitle}</p>
                <br />
                <hr />
                <h4>Description: </h4>
                <p>{eDescription}</p>
                <br />
                <hr />
                <h4>Questions:</h4>
                <p>{eQuestions}</p>
                <br />
                <hr />
                <h4>Applicants:</h4>
                <p>{applicantString}</p>
                <br />
                <hr />
                <h4>Encrypted AES hash:</h4>
                <p>{eHashAES}</p>
                <br />
                <hr />
            </div>
        </>
    );
};

export default ExamForm;
