import { FlexboxGrid } from "rsuite";
import ExamEdit from "../components/ExamEdit";
import Header from "../components/Header";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

const PageEditExam = () => {
    return (
        <>
            <Header />
            <FlexboxGrid>
                <FlexboxGridItem colspan={6}/>
                <FlexboxGridItem colspan={12}>
                <ExamEdit/>
                </FlexboxGridItem>
                <FlexboxGridItem colspan={6}/>
            </FlexboxGrid>
        </>
    );
};

export default PageEditExam;
