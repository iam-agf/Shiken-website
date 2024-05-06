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
    const [AESContent, setAESContent] = useState("")
    const [priv, setPriv] = useState<string>()
    const [pubKey, setPubKey] = useState<forge.pki.rsa.PublicKey>()

    // Exam data
    const [eTitle, setETitle] = useState<string>(title)
    const [eQuestions, setEQuestions] = useState<string>(questions)
    const [eDescription, setEDescription] = useState<string>(description)
    const [eApplicantString, setEApplicantString] = useState<string>(applicantString)
    const [eHashAES, setEHashAES] = useState<string>(applicantString)
    const [eHashRSA, setEHashRSA] = useState<string>(applicantString)


    // Generates the RSA keys for the encryption process of random AES for content
    useEffect(() => {
        // RSA keys
        const { publicKey, privateKey }: forge.pki.rsa.KeyPair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
        setPubKey(publicKey)
        setPriv(forge.pki.privateKeyToPem(privateKey))
    }, [])

    // AES key for user to encrypt private key
    useEffect(() => {
        if (priv && AES != "") {
            // SHA256 Generator
            const md = forge.md.sha256.create();
            // Hashes the password of the customer to a string of 64 bytes
            md.update(AES);
            // Truncates to 32 bytes
            const sha256String = md.digest().toHex();
            /// Getting the Key and the IV for the AES encrypt
            const sha256Key = sha256String.substring(0, 32)
            const sha256IV = sha256String.substring(33, 64)
            // Converts this 32-string into a key for the AES encryption
            const keyBytes = forge.util.createBuffer(sha256Key);
            // Starts encrypting by creating a encrypter generator using the given key
            const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);
            // Converts the string into bytes
            const messageBytes = forge.util.createBuffer(priv, 'utf8');
            // Starts by giving an iv key of 32 bytes
            cipher.start({ iv: sha256IV });
            cipher.update(messageBytes);
            cipher.finish();
            const encryptedHex = cipher.output.toHex();
            setEHashRSA(encryptedHex);
        }
    }, [AES])

    // encrypts all content of exam
    useEffect(() => {
        if (pubKey) {
            // Random content
            const randomBytesKey = forge.random.getBytesSync(32);
            const randomBytesIV = forge.random.getBytesSync(32);
            const bytesKey = forge.util.createBuffer(randomBytesKey);
            const bytesIV = forge.util.createBuffer(randomBytesIV);
            const stringKey = forge.util.bytesToHex(randomBytesKey);
            const stringIV = forge.util.bytesToHex(randomBytesIV);
            const storingAESCombiation = `${stringKey}@${stringIV}`;

            // Storing random AES encrypted with RSA
            let eAESContent: string = forge.util.encode64(pubKey!.encrypt(storingAESCombiation));
            setEHashAES(eAESContent);

            // Starting to encrypt content of Exam
            if (randomBytesKey && randomBytesIV) {
                // AES Encrypter with generated key
                const cipher = forge.cipher.createCipher('AES-CBC', bytesKey);
                // Convertir todos los inputs a bytes
                const titleBytes = forge.util.createBuffer(title, 'utf8');
                const descriptionBytes = forge.util.createBuffer(description, 'utf8');
                const questionsBytes = forge.util.createBuffer(questions, 'utf8');
                const applicantStringBytes = forge.util.createBuffer(applicantString, 'utf8');

                // Empezando en encriptado
                // Title
                cipher.start({ iv: randomBytesIV });
                cipher.update(titleBytes);
                cipher.finish();
                const eT = cipher.output.toHex();
                setETitle(eT);
                // Description
                cipher.start({ iv: randomBytesIV });
                cipher.update(descriptionBytes);
                cipher.finish();
                const eD = cipher.output.toHex();
                setEDescription(eD)
                // Questions
                cipher.start({ iv: randomBytesIV });
                cipher.update(questionsBytes);
                cipher.finish();
                const eQ = cipher.output.toHex();
                setEQuestions(eQ);
                // Applicant String
                cipher.start({ iv: randomBytesIV });
                cipher.update(applicantStringBytes);
                cipher.finish();
                const eAS = cipher.output.toHex();
                setEApplicantString(eAS)
            }
        }
    }, [title, description, questions, applicantString, pubKey])

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
                <h4>Encrypted RSA hash:</h4>
                <p>{eHashRSA}</p>
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
