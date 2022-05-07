const slotAbi = [{"inputs":[],"name":"contractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentRandom","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"random","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"start","outputs":[],"stateMutability":"payable","type":"function"}]

const slotContract = web3 =>{
    return new web3.eth.Contract(
        slotAbi,
        "0x9D7f3C7085CAea47c01DbDddEc68D1e99aDCe9a5"
    )
}

export default slotContract