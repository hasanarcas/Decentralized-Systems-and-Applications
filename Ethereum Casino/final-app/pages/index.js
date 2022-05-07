import Head from 'next/head'
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="container">
      
      <Head>
        <title>Welcome</title>
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

      <div className="jumbotron">
        <h1 className="display-4 text-center mt-5">Welcome to the Lottery Game!</h1>
        <p className="lead text-center mt-4">This is a simple web application that will help you to play the lottery game.</p>
        <hr className="my-4" />
        <p className='text-center text-dark h4 mb-5 mt-5'>You can play the different games by clicking the buttons below.</p>
        <div className="row">
          <div className="col-md-4">
            <div className="card" style={{backgroundColor: "rgb(255, 255, 255, 0.2)"}}>
              <div className="card-body">
                <h5 className="card-title text-center text-success">Lottery Game</h5>
                <p className="card-text text-center">This is a simple web application that will help you to play the lottery game.</p>
                <a href="http://localhost:3001/" className="btn btn-primary" style={{marginLeft: "140px"}}>Play Lottery</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{backgroundColor: "rgb(255, 255, 255, 0.2)"}}>
              <div className="card-body">
                <h5 className="card-title text-center text-dark">Roulette Game</h5>
                <p className="card-text text-center">This is a simple web application that will help you to play the roulette game.</p>
                <a href="http://localhost:3002/" className="btn btn-primary" style={{marginLeft: "130px"}}>Play Roulette</a>
              </div>
            </div>
          </div>  
          <div className="col-md-4">
            <div className="card" style={{backgroundColor: "rgb(255, 255, 255, 0.2)"}}>
              <div className="card-body">
                <h5 className="card-title text-center text-danger">Slot Machine</h5>
                <p className="card-text text-center">This is a simple web application that will help you to play the Slot Machine game.</p>
                <a href="http://localhost:3003/" className="btn btn-primary" style={{marginLeft: "115px"}}>Play Slot Machine</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
