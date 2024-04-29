import ReactDOM from 'react-dom/client';
import App from './App';

window.onload = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  //look for the adena object
  if (!(window as any).adena) {
    //open adena.app in a new tab if the adena object is not found
    window.open("https://adena.app/", "_blank");
  } else {
    const root = ReactDOM.createRoot(
      document.getElementById('root') as HTMLElement
    );
    root.render(<App adena={(window as any).adena} />);
  }
};
