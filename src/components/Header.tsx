import { useState, useEffect, useContext } from 'react';
import ProviderContext from './../context/ProviderContext';
import NavHeader from './NavHeader';
import { parseResponse } from '../pieces/supportFuns';
import { FlexboxGrid } from 'rsuite';
import 'rsuite/FlexboxGrid/styles/index.css';
import Connect from '../services/adena/connectButton';

const Header = () => {
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
        <div className="show-grid">
            <FlexboxGrid >
                <FlexboxGrid.Item colspan={12}><NavHeader active={active} onSelect={setActive} /></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        Exam created by {owner ? owner : "Fetching data"}
                        <Connect/>
                    </div>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>);
};

export default Header;
