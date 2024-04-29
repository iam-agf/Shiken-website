import React, { useState, useEffect } from 'react';
import { AdenaGetAccount } from './AdenaInterfaces';
import axios from 'axios';
import cheerio from 'cheerio';

type Props = {
  adena?: any;
};


function App({ adena }: Props) {
  const [data, setData] = useState<AdenaGetAccount | null>(null)
  const [CallExamsAvailable, setCallExamsAvailable] = useState<any | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Getting information of the user and the address involved
        const valueGetAccount = await adena.GetAccount();
        setData(valueGetAccount);
        console.log(valueGetAccount)
        const pendingExams = `http://127.0.0.1:8888/r/dev/shikenrepository:NumberPendingExams/${valueGetAccount.data.address}`

        axios.get(pendingExams).then(function (response: any) {
          const tempElement = document.createElement('div');
          tempElement.innerHTML = response.data;
          const realmRender = tempElement.querySelector('#realm_render');
          const availableExams = realmRender ? realmRender.textContent : "";
          console.log(availableExams);
          setCallExamsAvailable(availableExams);
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>The address registered is: <code>{data ? data.data.address : "Fetching information..."} ({data ? data.data.coins : ""})</code></h2>
        <hr />
        <h2>Number of Pending Exams: {CallExamsAvailable ? CallExamsAvailable : ""}</h2>
      </header>
    </div>
  );
}

export default App;
