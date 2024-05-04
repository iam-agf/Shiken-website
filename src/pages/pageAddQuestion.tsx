import { FlexboxGrid } from "rsuite";
import Header from "../components/Header";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import QuestionForm from "../components/QuestionForm";

const PageAddQuestion = () => {
    return (
        <>
            <Header />
            <FlexboxGrid>
                <FlexboxGridItem colspan={6}/>
                <FlexboxGridItem colspan={12}>
                    <QuestionForm/>
                </FlexboxGridItem>
                <FlexboxGridItem colspan={6}/>
            </FlexboxGrid>
        </>
    );
};

export default PageAddQuestion;
