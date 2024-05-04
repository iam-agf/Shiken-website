import { useContext, useState } from "react";
import { Question } from "../pieces/Question.types";
import { AdenaService } from "../services/adena/adena";
import { EMessageType } from "../services/adena/adena.types";
import AccountContext from "../context/AccountContext";
import config from "../config";

type KindValue = "0" | "1" | "2";
const openQ = "2" as KindValue

const QuestionForm = () => {
    const { address } = useContext(AccountContext)
    const [statement, setStatement] = useState<string>("")
    const [kind, setKind] = useState<KindValue>("1")
    const [Option1, setOption1] = useState("1")
    const [Option2, setOption2] = useState("2")
    const [Option3, setOption3] = useState("3")
    const [Option4, setOption4] = useState("4")
    const [answer, setAnswer] = useState("2")

    const sendQuestion = async () => {
        let q: Question = {
            statement: "",
            kind: "0",
            options: "",
            answer: "",
        }
        if (statement.length < 5) {
            console.error("Size of statement is very short")
        } else {
            q.statement = statement
        }
        if (kind !== "1" && kind !== "2" && kind !== "0") {
            console.error("Kind isn't correct")
        } else {
            q.kind = kind as string
        }
        if (Option1 == "" || Option2 == "" || Option3 == "" || Option4 == "") {
            console.error("An option is empty")
        } else {
            let options = `${Option1},${Option2},${Option3},${Option4}`
            q.options = options
        }
        if (answer !== Option1 && answer !== Option2 && answer !== Option3 && answer !== Option4) {
            console.error("Answer not in options")
        } else {
            q.answer = answer
        }
        console.log(q)
        if (address) {
            if (q.kind == "2"){
                q.options = ""
                q.answer = ""
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
            <br />
            <br />
            <br />
            <form>
                <label>Enter your Question:
                    <input
                        type="text"
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                    />
                </label>
                <br />
                <label>Enter the kind of question:
                    <input type='radio' name='questionKind' id='0' value='0' onChange={e => setKind(e.target.value as KindValue)} />
                    <input type='radio' name='questionKind' id='1' value='1' onChange={e => setKind(e.target.value as KindValue)} />
                    <input type='radio' name='questionKind' id='2' value='2' onChange={e => setKind(e.target.value as KindValue)} />
                </label>
                <br />
                {kind !== openQ ?
                    <>
                        <label>Enter Options:
                            <input
                                type="text"
                                onChange={(e) => setOption1(e.target.value)}
                            />
                            <input
                                type="text"
                                onChange={(e) => setOption2(e.target.value)}
                            />
                            <input
                                type="text"
                                onChange={(e) => setOption3(e.target.value)}
                            />
                            <input
                                type="text"
                                onChange={(e) => setOption4(e.target.value)}
                            />
                        </label>
                        <br />
                        <label>Choose answer
                            <input type='radio' name='answer' id={`${Option1}`} value={Option1} onChange={e => setAnswer(e.target.value)} />
                            <input type='radio' name='answer' id={`${Option2}`} value={Option2} onChange={e => setAnswer(e.target.value)} />
                            <input type='radio' name='answer' id={`${Option3}`} value={Option3} onChange={e => setAnswer(e.target.value)} />
                            <input type='radio' name='answer' id={`${Option4}`} value={Option4} onChange={e => setAnswer(e.target.value)} />
                        </label>
                    </>
                    : <></>}
                <br />
                <button type="button" onClick={sendQuestion}>
                    Send Question
                </button>
            </form>
        </>
    );
};

export default QuestionForm;
