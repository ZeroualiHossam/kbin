import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root')); //root es el elemento html donde estará nuestra app
root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);

//App es el componente principal de nuestra app, devuelve un objeto como si fuera un button en html

//React.StrictMode es un componente que nos ayuda a identificar problemas en nuestra app
//En React, jsx solo muestra un componente a la vez, por lo que si queremos mostrar varios componentes, debemos envolverlos en un solo componente
//Un componente devuelve un conjunto de componentes y React renderiza elementos no componentes
//En este caso, envolvemos el componente App en React.StrictMode pero de base se usa <> </>
reportWebVitals(); //reportWebVitals es una función que mide el rendimiento de nuestra app
