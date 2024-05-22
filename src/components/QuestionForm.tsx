import { useContext, useEffect, useState } from "react";
import { Question, Crypto } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge from 'node-forge';
import "../style.css"
import { encryptMessage } from "../pieces/supportFuns";

const QuestionForm = () => {
    const { address } = useContext(AccountContext)
    const [cryptoData, setCryptoData] = useState<Crypto>({ salt: "", randomAES: "" })
    const [question, setQuestion] = useState<Question>({
        topic: "",
        statement: "",
        kind: "1",
        options: "",
        answer: "",
        hashAES: "",
    })
    const [encryptedQuestion, setEncryptedQuestion] = useState<Question>({
        topic: "",
        statement: "",
        kind: "1",
        options: "",
        answer: "",
        hashAES: "",
    })

    // Options. Will join them in Options
    const [Option1, setOption1] = useState("1")
    const [Option2, setOption2] = useState("2")
    const [Option3, setOption3] = useState("3")
    const [Option4, setOption4] = useState("4")

    // Updates information related to options
    useEffect(() => {
        let options: string = ""
        if (Option1 !== "") {
            options = `${Option1},${Option2},${Option3},${Option4}`
        }
        setQuestion(prev => ({ ...prev, options: options }))
    },
        [Option1, Option2, Option3, Option4])

    // Updates the options and answer based on kind
    useEffect(() => {
        if (question.kind === "0") {
            setOption1("1")
            setOption2("2")
            setOption3("3")
            setOption4("4")
        }
        if (question.kind === "1") {
            setOption1("True")
            setOption2("False")
            setOption3("Can't be determined")
            setOption4("No answer")
        }
        if (question.kind === "2") {
            setOption1("")
            setOption2("")
            setOption3("")
            setOption4("")
            setQuestion(prev => ({ ...prev, options: "", answer: "" }))
        }
        setEncryptedQuestion(prev => ({ ...prev, kind: question.kind }))
    }, [question.kind])

    // AES key for user
    useEffect(() => {
        generateKeys()
        if (cryptoData.randomAES !== "" && cryptoData.salt !== "") {
            encryptRandomAES();
            const parts = cryptoData.randomAES.split("@");
            const bytesKey = forge.util.hexToBytes(parts[0]);
            const randomBytesIV = forge.util.hexToBytes(parts[1]);
            encryptQuestion(bytesKey, randomBytesIV);
        }
    }, [cryptoData.salt, question])

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
        setEncryptedQuestion(prev => ({ ...prev, hashAES: encriptedRandomAES }));
    }

    function encryptQuestion(Key: string, randomBytesIV: string) {
        setEncryptedQuestion(prev => ({
            ...prev,
            topic: encryptMessage(question.topic, Key, randomBytesIV),
            statement: encryptMessage(question.statement, Key, randomBytesIV),
            options: encryptMessage(question.options, Key, randomBytesIV),
            answer: encryptMessage(question.answer, Key, randomBytesIV),
        }));
    }

    const sendQuestion = async () => {
        if (question.statement.length < 5) {
            console.error("Size of statement is very short")
        }
        if (question.kind !== "1" && question.kind !== "2" && question.kind !== "0") {
            console.error("Kind isn't correct")
        }
        if (question.kind !== "2" && (Option1 === "" || Option2 === "" || Option3 === "" || Option4 === "")) {
            console.error("An option is empty")
        }
        const options = [Option1, Option2, Option3, Option4];
        if (question.kind !== "2" && !options.includes(question.answer)) {
            console.error("Answer not in options")
        }
        if (address !== null) {
            if (question.kind === "1") {
                question.options = `"True","False","Can't be determined","No answer"`
            }
            let response = await AdenaService.sendTransaction(
                [
                    {
                        type: EMessageType.MSG_CALL,
                        value: {
                            caller: address,
                            send: '',
                            pkg_path: config.REALM_PATH,
                            func: 'AddQuestion',
                            args: [
                                encryptedQuestion.topic,
                                encryptedQuestion.statement,
                                encryptedQuestion.kind,
                                encryptedQuestion.options,
                                encryptedQuestion.answer,
                                encryptedQuestion.hashAES,
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
            <br />
            <br />
            <h2>Add your question</h2>
            <form>
                <label>Encryption password (This password is only responsibility of the creator, and shouldn't be shared):
                    <input
                        type="text"
                        onChange={(e) => setCryptoData(prev => ({ ...prev, salt: e.target.value }))}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Question:
                    <input
                        type="text"
                        value={question.statement}
                        onChange={(e) => setQuestion(prev => ({ ...prev, statement: e.target.value }))} />
                </label>
                <br />
                <hr />
                <label>Enter your Topic:
                    <input
                        type="text"
                        value={question.topic}
                        onChange={(e) => setQuestion(prev => ({ ...prev, topic: e.target.value }))} />
                </label>
                <br />
                <hr />
                <label>Enter the kind of question:
                    <input type='radio' name='questionKind' id='0' value='0' onChange={e => setQuestion(prev => ({ ...prev, kind: e.target.value }))} />
                    <input type='radio' name='questionKind' id='1' value='1' onChange={e => setQuestion(prev => ({ ...prev, kind: e.target.value }))} />
                    <input type='radio' name='questionKind' id='2' value='2' onChange={e => setQuestion(prev => ({ ...prev, kind: e.target.value }))} />
                </label>
                <br />
                {question.kind !== "2" ?
                    <>
                        {question.kind !== "1" ?
                            <>
                                <hr />
                                <label>Enter Options:
                                    <input type="text" value={`${Option1}`} onChange={(e) => setOption1(e.target.value)} />
                                    <input type="text" value={`${Option2}`} onChange={(e) => setOption2(e.target.value)} />
                                    <input type="text" value={`${Option3}`} onChange={(e) => setOption3(e.target.value)} />
                                    <input type="text" value={`${Option4}`} onChange={(e) => setOption4(e.target.value)} />
                                </label>
                                <br />
                                <hr />
                                <label>Choose answer
                                    <input type='radio' name='answer' id={`${Option1}`} value={Option1} onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id={`${Option2}`} value={Option2} onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id={`${Option3}`} value={Option3} onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id={`${Option4}`} value={Option4} onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                </label>
                            </>
                            :
                            <>
                                <hr />
                                <label>Choose answer (True-False)
                                    <input type='radio' name='answer' id="True" value="True" onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id="False" value="False" onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id="Can't be determined" value="Can't be determined" onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                    <input type='radio' name='answer' id="No answer" value="No answer" onChange={e => setQuestion(prev => ({ ...prev, answer: e.target.value }))} />
                                </label>
                                <br />
                            </>
                        }
                    </>
                    : <></>}
                <hr />
                <button type="button" onClick={sendQuestion}>
                    Send Question
                </button>
            </form>
            <div>
                <h2>You're sending</h2>
                <br />
                <hr />
                <h4>Statement: </h4>
                <p>{encryptedQuestion.statement}</p>
                <br />
                <hr />
                <h4>Kind:</h4>
                <p>{encryptedQuestion.kind}</p>
                <br />
                <hr />
                <h4>Options:</h4>
                <p>{encryptedQuestion.options}</p>
                <br />
                <hr />
                <h4>Answer:</h4>
                <p>{encryptedQuestion.answer}</p>
                <br />
                <hr />
            </div>
        </>
    );
};

export default QuestionForm;
