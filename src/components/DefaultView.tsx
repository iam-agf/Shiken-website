import { FlexboxGrid } from "rsuite";
import FlexboxGridItem from "rsuite/esm/FlexboxGrid/FlexboxGridItem";
import Sidebar from "./Sidebar/Sidebar";
import Connect from "../services/adena/connectButton";
import { useContext, useEffect, useState } from "react";
import ProviderContext from "../context/ProviderContext";
import { parseResponse } from "../pieces/supportFuns";
import 'rsuite/FlexboxGrid/styles/index.css';

interface Content {
    component: React.ComponentType;
}

const DefaultView: React.FC<Content> = ({ component: Component }) => {
    const [active, setActive] = useState('home');

    const [owner, setOwner] = useState<string | null>(null);
    const { provider } = useContext(ProviderContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (provider) {
                    var creator = await provider.evaluateExpression('gno.land/r/dev/shikenrepository', 'GetCreator()');
                    creator = parseResponse(creator)
                    setOwner(creator);
                } else {
                    const creator = ""
                    setOwner(creator);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [provider]);

    console.log(owner);
    return (
        <>
            <FlexboxGrid>
                <FlexboxGridItem colspan={6}>
                    <Sidebar />
                </FlexboxGridItem>
                <FlexboxGridItem colspan={12}>
                    <Component />
                </FlexboxGridItem>
                <FlexboxGrid.Item colspan={6}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        Exam created by {owner ? owner : "Fetching data"}
                        <Connect />
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default DefaultView;
