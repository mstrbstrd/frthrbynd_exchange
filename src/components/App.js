import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import config from '../config.json';
import '../App.css';

import { 
  loadProvider, 
  loadNetwork,
  loadAccount,
  loadTokens,
  loadExchange,
  subscribeToEvents,
  loadAllOrders
} from '../store/interactions';

import Navbar from './Navbar';
import Markets from './Markets';
import Balance from './Balance.js';
import Order from './Order.js';
import PriceChart from './PriceChart.js';
import Transactions from './Transactions.js';
import Trades from './Trades.js';
import OrderBook from './OrderBook.js';



function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {

    // Connect ethers to blockchain
    const provider = loadProvider(dispatch)

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch current account & balance from metamask when changed
    window.ethereum.on('accountsChanged', () => {
      loadAccount(provider, dispatch)
    })
    

    // Load Token Smart Contracts
    const FRTHR = config[chainId].FRTHR
    const mETH = config[chainId].mETH
    await loadTokens(
      provider, 
      [FRTHR.address, mETH.address], 
      dispatch)

    // Load Exchange Smart Contract
    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch)

    // Fetch all orders: open, filled, cancelled
    loadAllOrders(provider, exchange, dispatch)

    // Listen to events
    subscribeToEvents(exchange, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()

  })

  return (
    <div>

      <Navbar />

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          <Transactions />

          <Trades />

          <OrderBook />

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
