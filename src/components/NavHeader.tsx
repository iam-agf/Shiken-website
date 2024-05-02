import { SyntheticEvent } from 'react';

import { Nav, Navbar } from 'rsuite';
import 'rsuite/Navbar/styles/index.css';
import 'rsuite/Nav/styles/index.css';

export const NavHeader = ({ active, onSelect }: { active: string, onSelect: (eventKey: any, event: SyntheticEvent<Element, Event>) => void }) => {
    
    return (
        <Navbar>
            <Navbar.Brand href="#">RSUITE</Navbar.Brand>
            <Nav appearance="tabs" onSelect={onSelect} activeKey={active}>
                <Nav.Item eventKey="1">Home</Nav.Item>
                <Nav.Item eventKey="2">News</Nav.Item>
                <Nav.Item eventKey="3">Products</Nav.Item>
                <Nav.Menu title="Creator">
                    <Nav.Item eventKey="4">Add Question</Nav.Item>
                    <Nav.Item eventKey="6">Edit Question</Nav.Item>
                    <Nav.Item eventKey="5">Add Exam</Nav.Item>
                    <Nav.Item eventKey="6">Edit Exam</Nav.Item>
                </Nav.Menu>
            </Nav>
        </Navbar>
    );
};

export default NavHeader;