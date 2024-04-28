import { useEffect, useState } from 'react';

import { useAppContext } from "../AppProvider";

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import ItemBlock from '../components/ItemBlock/ItemBlock';

import SellPage from './SellPage';
import ErrorPage from '../pages/ErrorPage'

import './ProfilePage.css';


export default function ProfilePage() {
    const { data, setData } = useAppContext();
    if (data == null) return 'Waiting...'

    const [status, setStatus] = useState(null);
    const [items, setItems] = useState(null);

    const [popup, setPopup] = useState(false);
    const [popupItem, setPopupItem] = useState(null);


    function getSkins() {
        useEffect(() => {
            (async () => {
                let _data = null;
                try {
                    _data = await fetch('http://127.0.0.1:8000/api/v1/get_inventory/', {
                            method: 'GET',
                            headers: {
                                "token": data['user']['token'],
                                "steam": data['user']['steam_id']
                            }
                        }
                    );
                    const response = await _data.json();
                    setStatus({'code': 200 , 'message': 'OK'});
                    setItems(response);
                } catch (error) {
                    if (_data == null) setStatus({'code': 503 , 'message': 'Service Unavailable'});
                    else if (_data.status == 401) {setStatus({'code': 403 , 'message': 'Forbidden'});
                }
            }})();
        }, []);
    }

    getSkins();

    function getItemsBlocks(_items) {
        return (
            <div style={{width: '100%', display: 'ruby', overflowY: 'scroll'}}>
                {_items.map(item => (
                    <ItemBlock item={item} onclickFunc={() => updatePopup(item)} />
                ))}
            </div>
        )
    }

    function updatePopup(_item) {
        setPopupItem(_item);
        setPopup(true);
    }

    function closePopup() {
        setPopupItem(null);
        setPopup(false);
    }

    
    function sellItem(marketHashName, icon_url, price) {
        window.location.href = '/sell?marketHashName=' + marketHashName + '&icon_url=' + icon_url + '&price=' + price;
    }

    console.log(items);

    if (status == null) return 'Waiting...'
    else if (status['code'] == 200) {
        if (items == null) return 'Waiting...';

        return (
            <>
                <Header />
                <main>
                    <div className='items-cont'>
                        {popup ? 
                        <div style={{width: '100%'}}>
                            <button style={{background: '#222831', color: '#fff', float: 'right', margin: '20px', border: '0px'}} onClick={closePopup}>X</button>
                            <ul style={{listStyle: 'none', padding: '0px', color: '#fff', margin: '20px'}}>
                                <li>
                                    <img src={'https://community.cloudflare.steamstatic.com/economy/image/' + popupItem['icon_url']} style={{width: '200px', height: '200px', display: 'block'}} />
                                </li>
                                <li>
                                    <p style={{fontSize: '20px', color: '#' + popupItem['rarity_color']}}>{popupItem['name']}</p>
                                </li>
                                <li>
                                    <p style={{fontSize: '20px'}}>Price: {(popupItem['price']['30_days']['median'] / 2).toFixed(2)}$</p>
                                </li>
                                <li>
                                    <a className="btn btn-primary" onClick={()=>{sellItem(popupItem['name'], popupItem['icon_url'], (popupItem['price']['30_days']['median'] / 2).toFixed(2))}}>Sell</a>
                                </li>
                            </ul>
                        </div> : getItemsBlocks(items['items'])}
                    </div>
                </main>
                <Footer />
            </>
        )
    } else {
        setData({});
        return <ErrorPage errorInfo={status} />;
    }
}