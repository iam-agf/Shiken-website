import { FlexboxGrid } from "rsuite";
import Header from "../components/Header";
import ExamForm from "../components/ExamForm";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

const PageAddExam = () => {
    return (
        <>
            <Header />
            <FlexboxGrid>
                <FlexboxGridItem colspan={6}/>
                <FlexboxGridItem colspan={12}>
                    <ExamForm/>
                </FlexboxGridItem>
                <FlexboxGridItem colspan={6}/>
            </FlexboxGrid>
        </>
    );
};

export default PageAddExam;
