import { useState } from "react";
import ReadQuestion from "./ReadQuestion";
import ReadExam from "./ReadExam";
import { Col, Grid, IconButton, Row } from "rsuite";
import DocPassIcon from '@rsuite/icons/DocPass';
import TaskIcon from '@rsuite/icons/Task';

const ReadData = () => {
    const [QuestionOrExam, setQuestionOrExam] = useState<string>("")

    function ReadType() {
        if (QuestionOrExam == "Question") {
            return <ReadQuestion />
        }
        if (QuestionOrExam == "Exam") {
            return <ReadExam password="" />
        }
    }
    return (
        <>
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        <IconButton icon={<TaskIcon />} onClick={() => setQuestionOrExam("Question")}>Question</IconButton>
                    </Col>
                    <Col xs={12}>
                        <IconButton icon={<DocPassIcon />} onClick={() => setQuestionOrExam("Exam")} > Exam</IconButton>
                    </Col>
                </Row>
            </Grid>
            <br />
            <br />
            {ReadType()}
        </>
    );
};

export default ReadData;
