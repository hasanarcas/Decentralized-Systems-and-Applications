import Head from 'next/head'
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="container">
      
      <Head>
        <title>Welcome</title>
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

      <div className="jumbotron">
        <h1 className="display-4 text-center mt-5">Welcome to the Lottery Game!</h1>
        <p className="lead text-center mt-4">This is a simple web application that will help you to play the lottery game.</p>
        <hr className="my-4" />
        <p className='text-center text-dark h4 mb-5 mt-5'>You can play the different games by clicking the buttons below.</p>
        <div className="row">
          <div className="col-md-6">
            <div className="card" style={{backgroundColor: "rgb(255, 255, 255, 0.2)"}}>
              <div className="card-body">
                <h5 className="card-title text-center text-success">Lottery Game</h5>
                <p className="card-text text-center">This is a simple web application that will help you to play the lottery game.</p>
                <a href="http://localhost:3001/" className="btn btn-primary" style={{marginLeft: "270px"}}>Play Lottery</a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card" style={{backgroundColor: "rgb(255, 255, 255, 0.2)"}}>
              <div className="card-body">
                <h5 className="card-title text-center text-danger">Roulette Game</h5>
                <p className="card-text text-center">This is a simple web application that will help you to play the roulette game.</p>
                <a href="http://localhost:3002/" className="btn btn-primary" style={{marginLeft: "270px"}}>Play Roulette</a>
              </div>
            </div>
          </div>  
        </div>
      </div>

    </div>
  )
}
