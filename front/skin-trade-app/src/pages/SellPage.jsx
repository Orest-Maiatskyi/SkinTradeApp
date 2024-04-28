import { useEffect, useState } from 'react';

import { useAppContext } from "../AppProvider";

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import ErrorPage from '../pages/ErrorPage'

import './ProfilePage.css';


export default function SellPage() {
    const { data, setData } = useAppContext();
    if (data == null) return 'Waiting...'

    const [sellResult, setSellResult] = useState(null);
    const [sellStatus, setSellStatus] = useState(null);

    function findGetParameter(parameterName) {
        var result = null,
            tmp = [];
        var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        }
        return result;
    }

    const sell = () => {
        //useEffect(() => {
            (async () => {
                let _data = null;
                try {
                    _data = await fetch('http://127.0.0.1:8000/api/v1/sell/', {
                            method: 'GET',
                            headers: {
                                "token": data['user']['token'],
                                "steam": data['user']['steam_id'],
                                "name": marketHashName,
                            }
                        }
                    );
                    const response = await _data.json();
                    setSellStatus({'code': 200, 'message': 'OK'});
                    setSellResult(response['message'])
                    if (response.code == 400) console.log('ALREADY SOLD');
                } catch (error) {
                    setSellStatus({'code': 400, 'message': 'ERROR'});
                }
            })();
        //}, []);
    }

    function cancel() {
        window.location.href = '/profile'
    }

    const [marketHashName, icon_url, price] = [findGetParameter('marketHashName'), findGetParameter('icon_url'), findGetParameter('price')];
    
    if (marketHashName == null || icon_url == null || price == null) return <ErrorPage errorInfo={{'code': 400 , 'message': 'Bad Request'}} />;

    return (
        <>
            <Header />
            <main>
                <div style={{width: '400px', margin: '0 auto', background: '#333', marginTop: 'calc(50vh - 200px)'}}>
                    {sellStatus != null && sellStatus['code'] == 200 ? 
                    <>
                        <span style={{color: '#fff', fontSize: '20px', textAlign: 'center', display: 'block', margin: '0 auto'}}>{sellResult}</span>
                        <button className='btn btn-primary' style={{width: '100%'}} onClick={()=>cancel()}>Go back</button>
                    </>
                    :
                    <>
                        <img style={{display: 'block', margin: '0 auto', height: '178px'}} src={'https://community.cloudflare.steamstatic.com/economy/image/' + icon_url} />
                        <span style={{color: '#fff', textAlign: 'center', margin: '0 auto', display: 'block', fontSize: '20px', paddingBottom: '10px'}}>Price: {price}$</span>
                        <div className='btn-cont'>
                            <button className='btn btn-primary' style={{width: '50%'}} onClick={() => sell()}>Sell</button>
                            <button className='btn btn-danger' style={{width: '50%'}} onClick={()=>cancel()}>Cancel</button>
                        </div>
                    </>}
                </div>
            </main>
            <Footer />
        </>
    )
}
