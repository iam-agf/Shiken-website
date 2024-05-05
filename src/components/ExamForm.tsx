import { useContext, useEffect, useState } from "react";
import { Exam } from "../pieces/Realm.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";
import forge from 'node-forge';
import "../style.css"

const ExamForm = () => {
    const { address } = useContext(AccountContext)

    // Exam data
    const [title, setTitle] = useState<string>("")
    const [questions, setQuestions] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [applicantString, setApplicantString] = useState<string>("")

    // Encryption values
    const [AES, setAES] = useState("")
    const [AESHex, setAESHex] = useState("")
    const [pub, setPub] = useState<string>()
    const [priv, setPriv] = useState<string>()
    const [pubKey, setPubKey] = useState<forge.pki.rsa.PublicKey>()

    // Exam data
    const [eTitle, setETitle] = useState<string>(title)
    const [eQuestions, setEQuestions] = useState<string>(questions)
    const [eDescription, setEDescription] = useState<string>(description)
    const [eApplicantString, setEApplicantString] = useState<string>(applicantString)


    // Generates the RSA keys for the encryption process
    useEffect(() => {
        // RSA keys
        const { publicKey, privateKey }: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
        setPub(forge.pki.publicKeyToPem(publicKey))
        setPubKey(publicKey)
        setPriv(forge.pki.privateKeyToPem(privateKey))
    }, [])

    // AES key for user
    useEffect(() => {

    }, [AES])

    // encrypts all
    useEffect(() => {
        if (pubKey) {
            let eT: string = forge.util.encode64(pubKey!.encrypt(title))
            let eQ: string = forge.util.encode64(pubKey!.encrypt(questions))
            let eD: string = forge.util.encode64(pubKey!.encrypt(description))
            let eAS: string = forge.util.encode64(pubKey!.encrypt(applicantString))
            setETitle(eT)
            setEDescription(eD)
            setEQuestions(eQ)
            setEApplicantString(eAS)
        }
    }, [title, description, questions, applicantString])

    const sendExam = async () => {
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
            console.log(e)
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
                                e.title,
                                e.description,
                                e.questions,
                                e.applicantString
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
            <h2>Add your Exam</h2>
            <form>
                <label>Encryption password (This password is only responsibility of the creator, and shouldn't be shared):
                    <input
                        type="text"
                        onChange={(e) => setAES(e.target.value)}
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
                <h4>Title: </h4>
                <p>{eDescription}</p>
                <br />
                <hr />
                <h4>Questions:</h4>
                <p>{eQuestions}</p>
                <br />
                <hr />
                <h4>Applicants:</h4>
                <p>{eApplicantString}</p>
                <br />
                <hr />
            </div>
        </>
    );
};

export default ExamForm;
