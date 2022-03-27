

const serverUrl = "";
const appId = "";
Moralis.start({ serverUrl, appId });


let userlogin=false;
   
      async function login() {
        let user = Moralis.User.current();
        if (!user) {
          user = await Moralis.authenticate();
        }
        console.log("logged in user:", user);
        userlogin=true;
        getStats();
      }

   
      async function logOut() {
        await Moralis.User.logOut();
        console.log("logged out");
        userlogin=false;
      }

     
      document.getElementById("btn-login").onclick = login;
      document.getElementById("btn-logout").onclick = logOut;
    
   
      function getStats() {
        const user = Moralis.User.current();
        if (user) {
          getUserTransactions(user);
        }
        getAverageGasPrices();
      }

   
      async function getUserTransactions(user) {
      
        const query = new Moralis.Query("EthTransactions");
        query.equalTo("from_address", user.get("ethAddress"));

       
        const subscription = await query.subscribe();
        handleNewTransaction(subscription);

       
        const results = await query.find();
        console.log("user transactions:", results);
      }

      
      async function handleNewTransaction(subscription) {
        
        subscription.on("create", function (data) {
          console.log("new transaction: ", data);
        });
      }

      
      async function getAverageGasPrices() {
        const results = await Moralis.Cloud.run("getAvgGas");
        console.log("average user gas prices:", results);
        renderGasStats(results);
      }

      function renderGasStats(data) {
        const container = document.getElementById("gas-stats");
        container.innerHTML = data
          .map(function (row, rank) {
            return `<li>#${rank + 1}: ${Math.round(row.avgGas)} gwei</li>`;
          })
          .join("");
      }

     
      getStats();
 
  

