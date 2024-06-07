import { Link } from 'react-router-dom';
import { Col, Grid, IconButton, Row } from 'rsuite';
import PcIcon from '@rsuite/icons/Pc';
import UserInfoIcon from '@rsuite/icons/UserInfo';
import VisibleIcon from '@rsuite/icons/Visible';
import EditIcon from '@rsuite/icons/Edit';
import DocPassIcon from '@rsuite/icons/DocPass';
import TaskIcon from '@rsuite/icons/Task';


export const Sidebar = () => {
    return (
        <Grid>
            <Col>
                <Row>
                    <Link to="/myData">
                        <IconButton icon={<UserInfoIcon />}>My data</IconButton>
                    </Link>
                </Row>
                <Row>
                    <Link to="/apply">
                        <IconButton icon={<PcIcon />}>Apply Exam</IconButton>
                    </Link>
                </Row>
                <Row>
                    <Link to="/addQuestion">
                        <IconButton icon={<TaskIcon />}>Add Question</IconButton>
                    </Link>
                </Row>
                <Row>
                    <Link to="/addExam">
                        <IconButton icon={<DocPassIcon />}>Add Exam</IconButton>
                    </Link>
                </Row>
                <Row>
                    <Link to="/editExam">
                        <IconButton icon={<EditIcon />}>Edit Exam</IconButton>
                    </Link>
                </Row>
                <Row>
                    <Link to="/readData">
                        <IconButton icon={<VisibleIcon />}>Read Data</IconButton>
                    </Link>
                </Row>
            </Col>
        </Grid>
    );
};

export default Sidebar;