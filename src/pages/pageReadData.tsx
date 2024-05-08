import { FlexboxGrid } from "rsuite";
import Header from "../components/Header";
import ReadData from "../components/ReadData";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";

const PageReadData = () => {
    return (
        <>
            <Header />
            <FlexboxGrid>
                <FlexboxGridItem colspan={6} />
                <FlexboxGridItem colspan={12}>
                    <ReadData />
                </FlexboxGridItem>
                <FlexboxGridItem colspan={6} />
            </FlexboxGrid>
        </>
    );
};

export default PageReadData;
