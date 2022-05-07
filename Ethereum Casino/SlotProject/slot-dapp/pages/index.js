import Head from 'next/head'
import "bootstrap/dist/css/bootstrap.min.css"
import Web3 from 'web3'
import { useState, useEffect } from 'react'
import slotContract from "../blockchain/slot"


export default function Home() {

  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [web3, setWeb3] = useState()
  const [scContract, setScContract] = useState()
  const [address, setAddress] = useState()
  const [balance, setBalance] = useState()
  const [currentRandom, setCurrentRandom] = useState()

  useEffect(() => {
    updateState()
  }, [scContract])

  const updateState = () => {
    if(scContract) getMachineMoney()
    if(scContract) getCurrentRandom()
  }

  const getMachineMoney = async () => {
    const machineMoney = await scContract.methods.contractBalance().call()
    setBalance(machineMoney)
  }

  const getCurrentRandom = async () => {
    const currentRandom = await scContract.methods.currentRandom().call()
    setCurrentRandom(currentRandom)
  }
  
  const play = async (value) => {
    try {
      await scContract.methods.start().send({ 
        from: address,
        value: value,
        gas: 300000,
        gasPrice: null
      })
      setSuccessMsg('You have successfully played the slot!')
      updateState()
    }catch(err){
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
        const sc = slotContract(web3)
        setScContract(sc)
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
    <div className="container">
      <Head>
        <title>Ethereum Slot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="http://localhost:3000/" style={{marginLeft: "180px"}}>Home</a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active" style={{marginLeft: "180px"}}>
              <a className="nav-link" href="http://localhost:3001/">Lottery Game</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="http://localhost:3002/" style={{marginLeft: "180px"}}>Roulette Game</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="http://localhost:3003/" style={{marginLeft: "180px"}}>Slot Game</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className='row mb-5 mt-2'>
        <div className='col align-self-start'>
          <h1 className='text-dark text-center'>Ethereum Slot Machine</h1>
          <p className="small text-success text-center h3">This is a Slot Machine App built on Ethereum</p>
        </div>
        <div className='col align-self-end mb-4'>
          <button onClick={connectWalletHandler} className="btn btn-success">Connect Wallet</button>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-6'>
          <h2 className='text-success'>Play the Game!</h2>
          <p className="small h3 text-danger">Enter the amount that you want to bet <strong className='text-dark'>(Wei)</strong></p>

          <div className="row">
            <div className="col-md-6">
              <input style={{backgroundColor: "rgb(0, 255, 0, 0.2)"}} name='betAmount' type="number" className="form-control" placeholder="Enter amount (Wei)" />  
            </div>
            <div className="col-md-6"> 
              <button onClick={() => play(document.querySelector('input[name="betAmount"]').value)} className="btn btn-success">Bet</button>
            </div>
          </div>

        </div>
        <div className='col-md-6'>
          <div className="card" style={{backgroundColor: "rgb(255, 0, 0, 0.2)"}}>
            <div className="card-body">
            <h2 className='text-dark text-center'>Bet some Ether to have the chance of winning 3x of your bet!!</h2>
            <h3 className='text-dark mt-5'>Current Ether in the Machine : <strong className='text-danger'>{balance} Wei</strong></h3>
            {currentRandom >= 67 && <p className='text-success text-center h3 mt-4'>You Won</p>}
            {currentRandom < 67 && <p className='text-danger text-center h3 mt-4  '>You Lost</p>}
            </div>
          </div>
        </div>
      </div>

      <p className="text-danger">{error}</p>
      <p className="text-success h3">{successMsg}</p>
    </div>
  )
}
