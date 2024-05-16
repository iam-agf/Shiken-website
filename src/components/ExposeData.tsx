import { useState, useEffect, useContext } from 'react';
import ProviderContext from './../context/ProviderContext';
import { parseResponse } from '../pieces/supportFuns';
import { FlexboxGrid } from 'rsuite';
import 'rsuite/FlexboxGrid/styles/index.css';
import Connect from '../services/adena/connectButton';

const ExposeData = ({ title, encryptedData, decryptedData }: { title: string, encryptedData: string, decryptedData: string }) => {
    return (
        <>
            <br />
            <hr />
            <h3>{title}</h3>
            {decryptedData !== "" ? <p>{decryptedData}</p> : <p>{encryptedData}</p>}
        </>
    );
};

export default ExposeData;
