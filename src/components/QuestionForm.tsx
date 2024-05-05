import { useContext, useEffect, useState } from "react";
import { Question } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge from 'node-forge';
import "../style.css"

type KindValue = "0" | "1" | "2";
const openQ = "2" as KindValue
const TrueFalseQ = "1" as KindValue

const QuestionForm = () => {
    const { address } = useContext(AccountContext)

    // Question data
    const [statement, setStatement] = useState<string>("")
    const [kind, setKind] = useState<KindValue>("1")
    // Options. Will join them in Options
    const [Option1, setOption1] = useState("1")
    const [Option2, setOption2] = useState("2")
    const [Option3, setOption3] = useState("3")
    const [Option4, setOption4] = useState("4")
    const [Options, setOptions] = useState("1,2,3,4")
    const [answer, setAnswer] = useState("2")

    // Encryption values
    const [AES, setAES] = useState("")
    const [AESHex, setAESHex] = useState("")
    const [pub, setPub] = useState<string>()
    const [priv, setPriv] = useState<string>()
    const [pubKey, setPubKey] = useState<forge.pki.rsa.PublicKey>()

    // Encrypted data
    const [eStatement, setEStatement] = useState(statement)
    const [eAnswer, setEAnswer] = useState(answer)
    const [eOptions, setEOptions] = useState(Options)

    // Generates the RSA keys for the encryption process
    useEffect(() => {
        // RSA keys
        const { publicKey, privateKey }: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
        setPub(forge.pki.publicKeyToPem(publicKey))
        setPubKey(publicKey)
        setPriv(forge.pki.privateKeyToPem(privateKey))
    }, [])

    // Updates information related to options
    useEffect(() => {
        let options: string = ""
        if (Option1 !== "") {
            options = `${Option1},${Option2},${Option3},${Option4}`
        }
        setOptions(options)
    },
        [Option1, Option2, Option3, Option4])

    // Updates the options and answer based on kind
    useEffect(() => {
        if (kind === "0") {
            setOption1("1")
            setOption2("2")
            setOption3("3")
            setOption4("4")
        }
        if (kind === "1") {
            setOption1("True")
            setOption2("False")
            setOption3("Can't be determined")
            setOption4("No answer")
        }
        if (kind === "2") {
            setOption1("")
            setOption2("")
            setOption3("")
            setOption4("")
            setOptions("")
            setAnswer("")
        }
    }, [kind])

    // AES key for user
    useEffect(() => {

     }, [AES])

    // encrypts all
    useEffect(() => {
        if (pubKey) {
            let eS: string = forge.util.encode64(pubKey!.encrypt(statement))
            let eO: string = forge.util.encode64(pubKey!.encrypt(Options))
            let eA: string = forge.util.encode64(pubKey!.encrypt(answer))
            setEAnswer(eA)
            setEStatement(eS)
            setEOptions(eO)
        }
    }, [answer, Options, statement])

    const sendQuestion = async () => {
        let q: Question = {
            statement: "",
            kind: "2",
            options: "",
            answer: "",
        }
        if (statement.length < 5) {
            console.error("Size of statement is very short")
        } else {
            q.statement = statement
        }
        let kindString: string = kind as string
        if (kindString !== "1" && kindString !== "2" && kindString !== "0") {
            console.error("Kind isn't correct")
        } else {
            q.kind = kind as string
        }
        if (Option1 === "" || Option2 === "" || Option3 === "" || Option4 === "") {
            console.error("An option is empty")
        } else {
            // This Options variable is already built
            q.options = Options
        }
        if (kindString !== "2" && (answer !== Option1 && answer !== Option2 && answer !== Option3 && answer !== Option4)) {
            console.error("Answer not in options")
        } else {
            q.answer = answer
        }
        if (address) {
            if (q.kind === "1") {
                q.options = `"True","False","Can't be determined","No answer"`
            }
            console.log(q)
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
                                q.statement,
                                q.kind,
                                q.options,
                                q.answer
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
                        onChange={(e) => setAES(e.target.value)}
                    />
                </label>
                <br />
                <hr />
                <label>Enter your Question:
                    <input
                        type="text"
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                    />
                </label>
                <br />
                <hr />
                <label>Enter the kind of question:
                    <input type='radio' name='questionKind' id='0' value='0' onChange={e => setKind(e.target.value as KindValue)} />
                    <input type='radio' name='questionKind' id='1' value='1' onChange={e => setKind(e.target.value as KindValue)} />
                    <input type='radio' name='questionKind' id='2' value='2' onChange={e => setKind(e.target.value as KindValue)} />
                </label>
                <br />
                {kind !== openQ ?
                    <>
                        {kind !== TrueFalseQ ?
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
                                    <input type='radio' name='answer' id={`${Option1}`} value={Option1} onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id={`${Option2}`} value={Option2} onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id={`${Option3}`} value={Option3} onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id={`${Option4}`} value={Option4} onChange={e => setAnswer(e.target.value)} />
                                </label>
                            </>
                            :
                            <>
                                <hr />
                                <label>Choose answer (TF)
                                    <input type='radio' name='answer' id="True" value="True" onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id="False" value="False" onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id="Can't be determined" value="Can't be determined" onChange={e => setAnswer(e.target.value)} />
                                    <input type='radio' name='answer' id="No answer" value="No answer" onChange={e => setAnswer(e.target.value)} />
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
                <p>{eStatement}</p>
                <br />
                <hr />
                <h4>Kind:</h4>
                <p>{kind}</p>
                <br />
                <hr />
                <h4>Options:</h4>
                <p>{eOptions}</p>
                <br />
                <hr />
                <h4>Answer:</h4>
                <p>{eAnswer}</p>
                <br />
                <hr />
            </div>
        </>
    );
};

export default QuestionForm;
