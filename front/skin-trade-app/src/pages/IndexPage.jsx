import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

import csgoLogo from '../static/csgo.jpg';
import dotaLogo from '../static/dota.jpg';


export default function IndexPage() {
    return (
        <>
            <Header />
            <main>
                <div style={{paddingTop: 'calc(50vh - 250px)'}}>
                    <h1 style={{textAlign: 'center', fontSize: '40px'}}>Welcome to Skin Trade</h1>
                    <h4 style={{textAlign: 'center', fontSize: '25px'}}>The best way to buy/sell skins</h4>
                    <div style={{width: '300px', margin: '0 auto'}}>
                        <img src={csgoLogo} style={{width: '200px'}} />
                        <img src={dotaLogo} style={{width: '100px'}}/>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
