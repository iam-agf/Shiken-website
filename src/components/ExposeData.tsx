import 'rsuite/FlexboxGrid/styles/index.css';

const ExposeData = ({ title, encryptedData, decryptedData }: { title: string, encryptedData: string, decryptedData: string }) => {
    return (
        <>
            <hr />
            <h3>{title}</h3>
            {decryptedData !== "" ? <p>{decryptedData} <i>({encryptedData.substring(0,5)}...{encryptedData.substring(encryptedData.length-5,encryptedData.length)})</i></p> : <p>{encryptedData}</p>}
        </>
    );
};

export default ExposeData;
