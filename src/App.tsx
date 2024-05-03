import { useState, useEffect } from 'react';
import { GnoWSProvider } from '@gnolang/gno-js-client';
import { IAccountContext } from './context/accountContext.types.js';
import { IProviderContext } from './context/providerContext.types.js';
import AccountContext from './context/AccountContext';

import ProviderContext from './context/ProviderContext';

import Config from './config';

import PageApply from './pages/pageApply.jsx';
import PageHome from './pages/pageHome.jsx';
import PageMyData from './pages/pageMyData.jsx';
import PageHowTo from './pages/pageHowTo.jsx';
import PageAddQuestion from './pages/pageAddQuestion.jsx';
import PageAddExam from './pages/pageAddExam.jsx';
import PageEditQuestion from './pages/pageEditQuestion.jsx';
import PageEditExam from './pages/pageEditExam.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
const App = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainID, setChainID] = useState<string | null>(null);

  // Only God knows
  const accountContext: IAccountContext = {
    address,
    chainID,

    setAddress,
    setChainID
  };

  // Provides the websocket required to connect to chain
  const [provider, setProvider] = useState<GnoWSProvider | null>(
    new GnoWSProvider(Config.CHAIN_RPC)
  );

  useEffect(() => { }, [provider]);

  // Still not sure
  const wsProvider: IProviderContext = {
    provider,
    setProvider
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PageHome />,
    },
    {
      path: "/apply",
      element: <PageApply />,
    },
    {
      path: "/howTo",
      element: <PageHowTo />,
    },
    {
      path: "/addQuestion",
      element: <PageAddQuestion />,
    },
    {
      path: "/editQuestion",
      element: <PageEditQuestion />,
    },
    {
      path: "/addExam",
      element: <PageAddExam />,
    },
    {
      path: "/editExam",
      element: <PageEditExam />,
    },
    {
      path: "/myData",
      element: <PageMyData />,
    },
  ])

  return (
    <ProviderContext.Provider value={wsProvider}>
      <AccountContext.Provider value={accountContext}>
      <RouterProvider router={router} />
      </AccountContext.Provider>
    </ProviderContext.Provider>
  );
};

export default App;
