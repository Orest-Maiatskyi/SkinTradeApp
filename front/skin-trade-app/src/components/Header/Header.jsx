import { useEffect, useState } from 'react';

import { useAppContext } from "../../AppProvider";

import './Header.css';


export default function Header() {
    const { data, setData } = useAppContext();
    const isAuthenticated = ('user' in data);
    const [balanceStatus, setBalanceStatus] = useState(null);
    const [balance, setBalance] = useState(null);

    function getBalance() {
        useEffect(() => {
            (async () => {
                let _data = null;
                try {
                    _data = await fetch('http://127.0.0.1:8000/api/v1/get_balance/', {
                            method: 'GET',
                            headers: {
                                "token": data['user']['token'],
                                "steam": data['user']['steam_id']
                            }
                        }
                    );
                    const response = await _data.json();
                    setBalanceStatus({'code': 200 , 'message': 'OK'});
                    setBalance(response['balance']);
                } catch (error) {
                    if (_data == null) setBalanceStatus({'code': 503 , 'message': 'Service Unavailable'});
                    else if (_data.status == 401) {setBalanceStatus({'code': 403 , 'message': 'Forbidden'});
                }
            }})();
        }, []);
    }

    getBalance(); 
    if (balanceStatus == null) return 'Waiting...'

    return (
        <header>
            <h3>Skin Trade App "Dev"</h3>

            {isAuthenticated ?
            <span>
                Balance: {balance}$
            </span>
            : <span/>
            }

            {isAuthenticated ?
            <div>
                <a className="btn btn-danger" onClick={()=>setData({})}>Logout</a>
                <a className="btn btn-primary" style={{marginRight: '20px'}} href="/profile">Profile</a>
            </div>
            :
            <a className="btn btn-primary" href="
                https://steamcommunity.com/openid/login?
                openid.ns=http://specs.openid.net/auth/2.0&
                openid.identity=http://specs.openid.net/auth/2.0/identifier_select&
                openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&
                openid.mode=checkid_setup&
                openid.return_to=http://localhost:5173/login&
                openid.realm=http://localhost:5173
                ">Login with Steam</a>
            }
        </header>
    )
}
