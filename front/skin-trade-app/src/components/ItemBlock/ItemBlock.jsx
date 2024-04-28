import { useEffect, useState } from 'react';

import './ItemBlock.css';


export default function ItemBlock({ item, onclickFunc }) {
    return (
        <div className='item-block' onClick={onclickFunc}>
            <img src={'https://community.cloudflare.steamstatic.com/economy/image/' + item['icon_url']} />
        </div>
    )
}
