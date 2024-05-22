import { SyntheticEvent } from 'react';

import { Nav, Navbar } from 'rsuite';
import 'rsuite/Navbar/styles/index.css';
import 'rsuite/Nav/styles/index.css';

export const NavHeader = ({ active, onSelect }: { active: string, onSelect: (eventKey: any, event: SyntheticEvent<Element, Event>) => void }) => {

    return (
        <Navbar>
            <Navbar.Brand href="/">Shiken</Navbar.Brand>
            <Nav appearance="tabs" onSelect={onSelect} activeKey={active}>
                <Nav.Item href="/apply">Apply Exam</Nav.Item>
                <Nav.Item href="/myData">My data</Nav.Item>
                <Nav.Item href="/howTo">How to</Nav.Item>
                <Nav.Item href="/addQuestion">Add Question</Nav.Item>
                <Nav.Item href="/addExam">Add Exam</Nav.Item>
                <Nav.Item href="/editExam">Edit Exam</Nav.Item>
                <Nav.Item href="/readData">Read Data</Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default NavHeader;