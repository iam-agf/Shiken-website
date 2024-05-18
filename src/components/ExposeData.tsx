import { useState, useEffect, useContext } from 'react';
import ProviderContext from './../context/ProviderContext';
import { parseResponse } from '../pieces/supportFuns';
import { FlexboxGrid } from 'rsuite';
import 'rsuite/FlexboxGrid/styles/index.css';
import Connect from '../services/adena/connectButton';

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
