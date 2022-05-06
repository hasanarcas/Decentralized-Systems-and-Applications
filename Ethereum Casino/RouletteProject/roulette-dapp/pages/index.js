import Head from 'next/head'
import "bootstrap/dist/css/bootstrap.min.css"
import Web3 from 'web3'
import rouletteContract from '../blockchain/roulette'
import { useState, useEffect } from 'react'

export default function Home() {

  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [rcContract, setRcContract] = useState()
  const [roulettePlayers, setPlayers] = useState([])
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [roulettePool, setRoulettePool] = useState("0")
  const [numberOfBets, setNumberOfBets] = useState("0")
  const [exists, setExists] = useState("")

  useEffect(() => {
    updateState()
  }, [rcContract])

  const updateState = () => {
    if (numberOfBets == 5) {
      setSuccessMsg("The maximum number of bets has been reached. The game is finished.")
    }
    if (rcContract) getPool()
    if (rcContract) getNumberOfBets()
  }

  const getNumberOfBets = async () => {
    setError('')
    try {
      const numberOfBets = await rcContract.methods.numberOfBets().call()
      setNumberOfBets(numberOfBets)
    } catch (err) {
      setError(err.message)
    }
  }

  const getPool = async () => {
    try{
      const pool = await rcContract.methods.pool().call()
      setRoulettePool(web3.utils.fromWei(pool, 'ether'))
    }catch(err){
      setError(err.message)
    }
  }

  const bet = async (number) => {
    setError('')
    setSuccessMsg('')
    try {
      await rcContract.methods.bet(number).send({ 
        from: address,
        value: document.querySelector('input[name="betAmount"]').value,
        gas: 300000,
        gasPrice: null
      })
      setSuccessMsg("Bet placed successfully")
      updateState()
    } catch (err) {
      setError(err.message)
    }
  } 

  const checkPlayerExists = async (address) => {
    setError('')
    setSuccessMsg("")
    try {
      const exists = await rcContract.methods.checkPlayerExists(address).call()
      if(exists){
        setExists("Player already in game")
      }else{
        setExists("Player not in game")
      }
    } catch (err) {
      setError(err.message)
    }
  }


  const connectWalletHandler = async () => {
    setError('')
    setSuccessMsg('')
    /* check if MetaMask is installed */
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* request wallet connection */
        await window.ethereum.request({ method: "eth_requestAccounts"})
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance in React state */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts()
        /* set account 1 to React state */
        setAddress(accounts[0])

        /* create local contract copy */
        const rc = rouletteContract(web3)
        setRcContract(rc)
        setSuccessMsg("MetaMask Wallet Connected Successfully") 

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()
          console.log(accounts[0])
          /* set account 1 to React state */
          setAddress(accounts[0])
          })
        } catch(err) {
          setError(err.message)
        }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask")
    }
  }

  return (
    <div className='container'>
      <Head>
        <title>Roulette dApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="http://localhost:3000/" style={{marginLeft: "250px"}}>Home</a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item active" style={{marginLeft: "250px"}}>
              <a class="nav-link" href="http://localhost:3001/">Lottery Game</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="http://localhost:3002/" style={{marginLeft: "250px"}}>Roulette Game</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className='row mb-5 mt-2'>
        <div className='col align-self-start'>
          <h1 className='text-dark text-center'>Ethereum Roulette</h1>
          <p className="small text-success text-center h3">This is a Roulette App built on Ethereum</p>
          <p className="small text-danger text-center h3">The game finishes when 5 players enter the game</p>

        </div>
        <div className='col align-self-end mb-4'>
          <button onClick={connectWalletHandler} className="btn btn-success">Connect Wallet</button>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-6'>
          <h2 className='text-success'>Play the Game!</h2>
          <p className="small h3 text-danger">Enter the amount that you want to bet</p>

          <div className="row">
            <div className="col-md-6">
              <input style={{backgroundColor: "rgb(0, 255, 0, 0.2)"}} name='betAmount' type="number" className="form-control" placeholder="Enter amount" />  
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <input style={{backgroundColor: "rgb(0, 0, 0, 0.2)"}} name='betNumber' type="number" className="form-control" placeholder="Enter the number to bet" /> 
            </div>
            <div className="col-md-6"> 
              <button onClick={() => bet(document.querySelector('input[name="betNumber"]').value)} className="btn btn-success">Bet</button>
            </div>
          </div>

          <div className="row mt-5">
            <div className='col-md-6'>
              <div className='card' style={{backgroundColor: "rgb(0, 0, 0, 0.1)"}}>
                <div className='card-body'>
                  <h5 className='card-title text-danger'>Number of Players</h5>
                  <p className='card-text'>The current number of players is <strong className='text-success'>{numberOfBets}</strong></p>
                </div>
              </div>
            </div>
          </div>

        </div>


        <div className='col-md-6'>
          <div className='card' style={{backgroundColor: "rgb(0, 255, 0, 0.1)"}}>
            <div className='card-body'>
              <h3 className='card-title'>Roulette Pool</h3>
              {/* print pool in WEI */}
              <p className='card-text h5' >The current pool is <strong className='text-danger h4'>{roulettePool} ETH</strong></p>
            </div>
          </div>
          
          <div className="card mt-5" style={{backgroundColor: "rgb(0, 255, 0, 0.1)"}}>
            <div className="row">
              <div className="col-md-6 mt-5">
                <input style={{backgroundColor: "rgb(0, 0, 0, 0)"}} className='form-control' name='checkExists' type="text" placeholder='Check if player is in game'/>
              </div>
              <div className="col-md-6 mt-5">
                <button onClick={() => checkPlayerExists(document.querySelector('input[name="checkExists"]').value)} className="btn btn-dark ml-5">Check</button>
              </div>
              {/* if player exist text-success else text-danger */}
              <div className="col-md-6 mt-5">
                <p className={exists === "Player already in game" ? "text-success h3" : "text-danger h3"}>{exists}</p>
              </div>
            </div>
          </div>
          
         
        </div>
        
      </div>
      <p className="text-danger">{error}</p>
      <p className="text-success h3">{successMsg}</p>
    </div>
  )
}
