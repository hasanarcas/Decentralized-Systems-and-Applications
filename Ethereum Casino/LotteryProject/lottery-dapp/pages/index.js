import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import lotteryContract from '../blockchain/lottery'
import 'bootstrap/dist/css/bootstrap.css'

export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [lcContract, setLcContract] = useState()
  const [lotteryPot, setLotteryPot] = useState()
  const [lotteryPlayers, setPlayers] = useState([])
  const [lotteryHistory, setLotteryHistory] = useState([])
  const [lotteryId, setLotteryId] = useState()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    updateState()
  }, [lcContract])

  const updateState = () => {
    if (lcContract) getPot()
    if (lcContract) getPlayers()
    if (lcContract) getLotteryId()
  }

  const getPot = async () => {
    const pot = await lcContract.methods.getBalance().call()
    setLotteryPot(web3.utils.fromWei(pot, 'ether'))
  }

  const getPlayers = async () => {
    const players = await lcContract.methods.getPlayers().call()
    setPlayers(players)
  }

  const getHistory = async (id) => {
    setLotteryHistory([])
    for (let i = parseInt(id); i > 0; i--) {
      const winnerAddress = await lcContract.methods.lotteryHistory(i).call()
      const historyObj = {}
      historyObj.id = i 
      historyObj.address = winnerAddress
      setLotteryHistory(lotteryHistory => [...lotteryHistory, historyObj])
    }
  }

  const getLotteryId = async () => {
    const lotteryId = await lcContract.methods.lotteryId().call()
    setLotteryId(lotteryId)
    await getHistory(lotteryId)
  }

  const enterLotteryHandler = async () => { 
    setError('')
    setSuccessMsg('')
    try {
      await lcContract.methods.enter().send({
        from: address,
        value: '15000000000000000', 
        gas: 300000,
        gasPrice: null
      })
      updateState()
    } catch(err) {
      setError(err.message)
    }
  }

  const pickWinnerHandler = async () => {
    setError('')
    setSuccessMsg('')
    console.log(`address from pick winner :: ${address}`)
    try {
      await lcContract.methods.pickWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null
      })
      const winnerAddress = lotteryHistory[lotteryId -1].address
      setSuccessMsg(`The winner is ${winnerAddress}`)
    } catch(err) {
      setError(err.message)
    }
  }

  const payWinnerHandler = async () => {
    setError('')
    setSuccessMsg('')
    try {
      await lcContract.methods.payWinner().send({
        from: address,
        gas: 300000,
        gasPrice: null
      })
      console.log(`lottery id :: ${lotteryId}`)
      updateState()
    } catch(err) {
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
        const lc = lotteryContract(web3)
        setLcContract(lc)

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
        <title>Ethereum Casino</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='row mb-5 mt-2'>
        <div className='col align-self-start'>
          <h1 className='text-success text-center'>Ethereum Lottery</h1>
          <p className="small text-primary text-center">This is a Lottery App built on Ethereum</p>
        </div>
        <div className='col align-self-end mb-4'>
          <button onClick={connectWalletHandler} className="btn btn-success">Connect Wallet</button>
        </div>
      </div>

      {/* split the page into two halves */}
      <div className='row'>
        <div className='col-md-6'>
          <h2 className='text-success'>Enter the Lottery</h2>
          <p className="small text-primary">Enter the lottery by sending 0.015 Ether</p>
          <button onClick={enterLotteryHandler} className='btn btn-info'>Play Now!</button>
          <br />
          <br />
          <br />
          <h2 className='text-primary'>Pick the winner</h2>
          <p className="text-danger"><b>(Admin Only)</b></p>
          <button onClick={pickWinnerHandler} className='btn btn-primary'>Pick Winner</button>
          <br />
          <br />
          <br />
          <h2 className='text-primary'>Pay the winner</h2>
          <p className="text-danger"><b>(Admin Only)</b></p>
          <button onClick={payWinnerHandler} className='btn btn-success'>Pay Winner</button>
          {
            error != "" && <section className='card mt-5'>
              <p className='small text-danger mt-3'>{error}</p>
            </section>
          }
          {
            successMsg != "" && <section className='card mt-5'>
              <p className='small text-success mt-3'>{successMsg}</p>
            </section>
          }
        </div>
        <div className='col-md-6'>
          {/* create a card */}
          <div className='card' style={{backgroundColor: "rgb(0, 0, 0, 0)"}}>
            <div className='card-body'>
              <h2 className='card-title text-danger text-center'>Lottery Status</h2>
              {
                (lotteryHistory && lotteryHistory.length > 0) && lotteryHistory.map(item => {
                  if (lotteryId != item.id) {
                    return <div className="history-entry mt-3" key={item.id}>
                      <div>Lottery #{item.id} winner:</div>
                      <div> 
                        <a href={`https://etherscan.io/address/${item.address}`} target="_blank">
                          {item.address}
                        </a>
                      </div>
                    </div>
                  }
                })
              }
              <br />
              <br />
              <h2 className='card-title text-danger text-center'>Players(1)</h2>
              <ul className="list-group">
                {
                  (lotteryPlayers && lotteryPlayers.length > 0) && lotteryPlayers.map((player, index) => {
                    return <li className='list-group-item' key={`${player}-${index}`}>
                      <a href={`https://etherscan.io/address/${player}`} target="_blank">
                        {player}
                      </a>
                    </li>
                  })
                }
              </ul>
              <br />
              <br />
              <h2 className='card-title text-danger text-center'>Lottery Pot</h2>
              <p className="card-text text-primary text-center h4">{lotteryPot} Ether</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}