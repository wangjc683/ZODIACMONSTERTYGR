import './style/banner.scss'
import logo from './images/logo.png'
import user from './images/user.png'
import bannerImg from './images/banner0.png'

function Menu(JOINUS_LINK) {
    const menuData = ['STORY', 'ROADMAP', 'FAQ']
    return (
        <div className="_flex menu wow animate__animated animate__fadeIn">
            <img className="logo" src={logo} alt="zodiac.monster"/>
            <div className="_flex">
                <ul className="_flex menu-data">
                    {menuData.map(item => {
                        return <li key={item}><a href={'#'+item}>{item}</a></li>
                    })}
                </ul>
                <img onClick={(e) => {
                        window.open(JOINUS_LINK, "_blank");
                      }} className="user" src={user} alt="user"/>
            </div>
        </div>
    )
}

function Banner(JOINUS_LINK){
    return (
        <div className="banner wow animate__animated animate__fadeIn">
            <div className="container">
                {Menu(JOINUS_LINK)}
                <div className="content">
                    <img width="100%" src={bannerImg} alt="" />
                    <p>In the year of da tiger, mint a TYGR!  A Chinese Zodiac Warrior.</p>
                </div>
            </div>
        </div>
    )
}

export default Banner;