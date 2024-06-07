import DefaultView from "../components/DefaultView";

const Home = () => {
    return (
        <DefaultView component={TmpHome} />
    );
};
const TmpHome = () => {return (<h1>Tmp Home</h1>);};

export default Home;
