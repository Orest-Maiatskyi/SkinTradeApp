import { useEffect, useState } from 'react';

import { useAppContext } from "../AppProvider";
import ErrorPage from "../pages/ErrorPage";
import IndexPage from './IndexPage';


export default function SteamLoginPage({ redirectTo }) {
    const { data, setData } = useAppContext();
    const params =  new URLSearchParams(window.location.search)

    const [status, setStatus] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetch(`http://localhost:8000/api/v1/auth?assoc_handle=${params.get("openid.assoc_handle")}&claimed_id=${params.get("openid.claimed_id")}&identity=${params.get("openid.identity")}&response_nonce=${params.get("openid.response_nonce")}&return_to=${params.get("openid.return_to")}&sig=${params.get("openid.sig")}&signed=${params.get("openid.signed")}`, {method: 'GET', headers: {}});
                if (data.ok) {
                    const response = await data.json();
                    setData({user: response});
                    setStatus({'code': 200 , 'message': 'OK'});
                } else setStatus({'code': 403 , 'message': 'Forbidden'});
            } catch(error) { setStatus({'code': 503 , 'message': 'Service Unavailable'}); }
        })();
    }, []);

    if (status == null) return 'Waiting...';
    else if (status['code'] == 200) window.location.href = '/';
    else return <ErrorPage errorInfo={status} />;
}
