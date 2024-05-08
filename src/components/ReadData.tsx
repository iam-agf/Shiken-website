import { useState } from "react";
import ReadQuestion from "./ReadQuestion";
import ReadExam from "./ReadExam";

const ReadData = () => {
    const [QuestionOrExam, setQuestionOrExam] = useState<string>("")

    function ReadType() {
        if (QuestionOrExam == "Question"){
            return <ReadQuestion/>
        }
        if (QuestionOrExam == "Exam"){
            return <ReadExam/>
        }
    }
    return (
        <>
              <button type="button" onClick={() => setQuestionOrExam("Question")}>Question</button>
              <button type="button" onClick={() => setQuestionOrExam("Exam")}>Exam</button>
              <br/>
              <br/>
              {ReadType()}
        </>
    );
};

export default ReadData;
