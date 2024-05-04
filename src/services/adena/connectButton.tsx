import { IConnectProps } from './connect.types';
import { FC, useContext, useState } from 'react';
import { AdenaService } from '../../services/adena/adena';
import { IAccountInfo } from '../../services/adena/adena.types';
import Config from '../../config';
import AccountContext from '../../context/AccountContext';

const Connect: FC<IConnectProps> = () => {
    const { setChainID, setAddress } = useContext(AccountContext);
    const [addr, setAddr] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handleWalletConnect = async () => {
        setIsLoading(true);
        try {
            // Attempt to establish a connection
            await AdenaService.establishConnection("");

            // Get the account info
            const info: IAccountInfo = await AdenaService.getAccountInfo();

            // Make sure the network is valid
            await AdenaService.switchNetwork(Config.CHAIN_ID);

            setAddr(info.address);
            // Update the account context
            setAddress(info.address);
            setChainID(Config.CHAIN_ID);
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    };

    return (
        <div>
            {isLoading ?
                <button onClick={handleWalletConnect}>
                    CONNECT WALLET
                </button > :
                <>
                    Current Address: {addr ? addr : ""}
                </>
            }
        </div>
    );
};

export default Connect;