import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import Banner from './banner'
import { WOW } from 'wowjs'
import './style/home.scss'

// imgs
import page2 from './images/page2.png'
import page30 from './images/page30.png'
import page31 from './images/page31.png'
import page4 from './images/page4.png'
import page5 from './images/page5.png'
import page6 from './images/page6.png'
import icon0 from './images/icon0.png'
import icon1 from './images/icon1.png'


const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

function page2Content(img, status) {
    if (status === 'SOLDOUT') {
        return (
            <div className="content sold_out">
                <p>THE 8888 UNIQUE TYGR ARE</p>
                <p className="count">SOLD OUT</p>
                <br/>
                <p>AND NOW AVAILABLE ON OPENSEA.</p>
                <button className="_btn"
                  onClick={(e) => {
                    window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                  }}
                >
                    GO TO OPENSEA
                    <img className="mar-left30" src={img} alt="" />
                </button>
            </div>

        )
    }
    return (
        <div className="content">
            <h2>A collection of</h2>
            <p className="count">8,888</p>
            <p>UNIQUE NFTS PROTECTING THE EARTH ON ETHEREUM BLOCKCHAIN.</p>
        </div>
    )
}

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    await new WOW().init();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  const getBuyStatus = () => {
    if (blockchain.account === "" || blockchain.smartContract === null) {
      return <button className="_btn"
        onClick={(e) => {
        e.preventDefault();
        dispatch(connect());
        getData();
      }}>CONNECT YOUR WALLET</button>
    } else {
      return <div><div className="_flex _buy">
          <button className="_btn" disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              decrementMintAmount();
            }}
          >-</button>
          <span>{mintAmount}</span>
          <button className="_btn" disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              incrementMintAmount();
            }}
          >+</button>
        </div>
        <button className="_btn" disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs();
              getData();
            }}
        >{claimingNft ? "BUSY" : "BUY"}</button></div>
    }
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <div>
        {Banner(CONFIG.JOINUS_LINK)}
        <div className="_flex page2">
            <img className="img wow animate__animated animate__fadeInLeft" src={page2} alt="" />
            <div className="_flex wow animate__animated animate__fadeInRight">
                {page2Content(icon0, CONFIG.STATUS)}
            </div>
        </div>
        <div className="page3">
            <div className="_flex container">
                <img src={page30} alt="" className="wow animate__animated animate__fadeInLeft" />
                <div className="content wow animate__animated animate__fadeIn">
                  { CONFIG.STATUS==='SOLDOUT' ? null : <div>
                          <h2>Mint them now and protect the Earth!<br/>Mint Price: 0.08ETH</h2>
                          {
                            blockchain.account === "" || blockchain.smartContract === null ?
                              <button className="_btn"
                                onClick={(e) => {
                                e.preventDefault();
                                dispatch(connect());
                                getData();
                              }}>{blockchain.account}CONNECT YOUR WALLET</button> : <div><div className="_flex _buy-content">
                                <button className="_btn _buy" disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    decrementMintAmount();
                                  }}
                                >-</button>
                                <span>{mintAmount}</span>
                                <button className="_btn _buy" disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    incrementMintAmount();
                                  }}
                                >+</button>
                              </div>
                              <button className="_btn" disabled={claimingNft ? 1 : 0}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    claimNFTs();
                                    getData();
                                  }}
                              >{claimingNft ? "BUSY" : "BUY"}</button></div>
                          }
                          <button className="_btn"
                              onClick={(e) => {
                                window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                              }}
                          >
                              GO TO OPENSEA
                              <img className="mar-left30" src={icon0} alt="" />
                          </button>
                      </div>
                  }
                    <button className="_btn" 
                      onClick={(e) => {
                        window.open(CONFIG.JOINUS_LINK, "_blank");
                      }}
                    >
                        JOIN US ON DISCORD
                        <img src={icon1} alt="" />
                    </button>
                </div>
                <img src={page31} alt="" className="wow animate__animated animate__fadeInRight" />
            </div>
        </div>
        <div className="_flex page4" id="STORY">
            <img className="img wow animate__animated animate__fadeInLeft" src={page4} alt="" />
            <div className="_flex flex_1 wow animate__animated animate__fadeInRight">
                <div className="content">
                    <p>Every year, one of the 12 zodiac warriors will come to protect the Earth from the evil monsters.  In 2022, the year of da tiger, we present the first zodiac warrior, TYGR! </p>
                    <p>Known for his mighty strength, Brother TYGR arrives on the Ethereum Blockchain, in the form of 8,888 unique NFTs, his powers forever protected on IPFS.</p>
                </div>
            </div>
        </div>
        <div className="_flex page5">
            <div className="img wow animate__animated animate__fadeInLeft">
                <h2>FIND YOUR CHINESE ZODIAC WARRIOR</h2>
                <img src={page5} alt="" />
            </div>
            <div className="_flex flex_1 wow animate__animated animate__fadeInRight">
                <div className="content">
                    <p>According to the ancient Chinese myth, a hideous monster called ‘Year’ would emerge every time the Earth completes one orbit around the Sun.  ‘Year’ shows no mercy to humankind and it’s determined to bring bad luck to us all!</p>
                    <p>Luckily!  Our planet is under the protection of 12 powerful Zodiac warriors, who take turns each year coming to the Earth and fight off the yearly evil monsters.  In 2022, we’re graced with the presence of mighty TYGR!</p>
                    <p>Brother TYGR is an easy-going young Zodiac Warrior, whose kind-hearted vibe transcends his mighty strengths.  TYGR’s power has been scattered around the world in various forms.  Mint these crouching TYGRs now, and help him protect the Earth!  (paws crossed)</p>
                </div>
            </div>
        </div>
        <div className="page6" id="ROADMAP">
            <div className="container">
                <div className="_flex wow animate__animated animate__fadeIn">
                    <div className="content">
                        <h2>ROADMAP</h2>
                        <p>We plan to launch a new Zodiac Warrior NFT collection every year, to show equal respect to all 12 Zodiac warriors!  Spoiler alert, BunBun booked in for 2023.</p>
                    </div>
                </div>
                <img className="wow animate__animated animate__fadeIn" src={page6} alt="" />
            </div>
        </div>
        <div className="page7 wow animate__animated animate__fadeInUp" id="FAQ">
            <h2>FAQ</h2>
            <div className="container">
              {
                (CONFIG.FAQ || []).map((item, index)=> {
                  return <div key={index}>
                    <p className="f">{item.F}</p>
                    <p>{item.Q}</p>
                    <br/>
                  </div>
                })
              }
            </div>
        </div>
    </div>
  )
}

export default App;
