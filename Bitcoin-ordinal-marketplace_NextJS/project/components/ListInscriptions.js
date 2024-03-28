import React from "react";
import {useEffect, useState} from "react";
import Ordinals from "./Ordinals";
import MyOrdinals from "./MyOrdinals";
import ConnectWallet from "./ConnectWallet";


export default function ListInscriptions() {
  const [tabs, setTabs] = useState(1);

  return (
    <div className="container mt-3">
      <ConnectWallet />
      <ul className="nav nav-tabs mt-4">
        <li className="nav-item">
          <a className={`nav-link ${tabs == 1 ? 'active': ''}`} href="#" onClick = {()=> {setTabs(1);}}>
            Ordinals
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${tabs == 2 ? 'active': ''}`} href="#" onClick = {()=> {setTabs(2);}}>
            My Ordinals
          </a>
        </li>
      </ul>
      {
        tabs == 1 ? <Ordinals /> : <></>
      }
      {
        tabs == 2 ? <MyOrdinals /> : <></>
      }

    </div>
  );
}
