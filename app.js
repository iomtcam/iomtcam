

App = {

  id: null,
  chanelidx: -1,
  web3Provider: null,
  contracts: {},


  init: async function() {

    return await App.initWeb3();
  },

  initWeb3: async function() {
    //local

    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3.eth.defaultAccount = web3.eth.accounts[0];
    return App.initContract();
  },

  initContract: async function() {
    $.getJSON('../build/contracts/Demo.json', function(data) {

     var DemoArtifact = data;
     App.contracts.Demo = TruffleContract(DemoArtifact);

     // Set the provider for our contract
     App.contracts.Demo.setProvider(App.web3Provider);

     // Use our contract to retrieve and mark the adopted pets
    }).then(function(){
      var demoInstance;

      App.contracts.Demo.deployed().then(function(instance){
        demoInstance = instance;
        return demoInstance.getProvider();
      }).then(function(vals){

        console.log(vals);
      });
    });
  },



  onClicked_deposit: function(){

    var demoInstance;
    var ethertodeposit;

    ethertodeposit = $("#amount_of_deposit").val();
    console.log("예금하려는 이더: "+ ethertodeposit);


    App.contracts.Demo.deployed().then(function(instance){
      demoInstance = instance;
      return demoInstance.deposit(web3.eth.defaultAccount, {value : ethertodeposit});
    });
  },

  onClicked_withdraw: function(){

    var demoInstance;

    App.contracts.Demo.deployed().then(function(instance){
      demoInstance = instance;
      return demoInstance.withdraw();
    });
  },

   onClicked_getbankbalance: function(){

      var demoInstance;

      App.contracts.Demo.deployed().then(function(instance){
        demoInstance = instance;

        return demoInstance.getbalance(web3.eth.defaultAccount);
      }).then(function(balance){
        val = balance;
        val /= 1000000000000000000;
        console.log(val.toString());
        $("#personalbalancelocation").text(val.toString() + "ETH");
      });
   },

   onClicked_connect: function(){
    //1. 필요한정보를 가져옴
    //2. user가 연결에 필요한 충분한 돈을 가지고 있는지 확인

    var demoInstance;

    var address;
    var time;
    var costpertime;
    var userbalance;
    var providerbalance;

    address = $("#provideraddress").val();
    time = $("#timetoconnect").val();

    //userbal, providerbal, costpertime 을 스마트컨트랙트에서 가져와야함
    App.contracts.Demo.deployed().then(function(instance){
        demoInstance = instance;

        return demoInstance.getbalance(web3.eth.defaultAccount);
      }).then(function(userbal){
        userbalance = userbal;

        return demoInstance.getbalance(address);
      }).then(function(providerbal){
        providerbalance = providerbal;

        return demoInstance.getProviderinfo(address);
      }).then(function(providerinfo){
        costpertime = providerinfo[1];

      }).then(function(){
        console.log("******************************test*****************************");
        console.log("targetid: "+ address);
        console.log("time to connect: "+ time);
        console.log("cost per time: " + costpertime);
        console.log("mybalance: "+ userbalance);
        console.log("provider balance: "+ providerbalance);
        console.log("******************************test*****************************");
      }).then(function(){
        //balance가 부족하면 연결안됌
        if(time* costpertime > userbalance){
          alert("연결에 필요한 돈이 부족합니다.");
        }
        //balance가 충분하면 연결실행
        else{
          demoInstance.openchanel(address).then(function(){
            return demoInstance.getchanelidx.call();
          }).then(function(val){
            console.log(val.toString());
          });
        }
      });

   },

  /*
  onClicked_openchanel: function(){

    var demoInstance;
    var otherid

    otherid = $("#otherid").val();

    App.contracts.Demo.deployed().then(function(instance){
      demoInstance = instance;
      return demoInstance.OpenChanel(otherid);
    }).then(function(v){
      return demoInstance.getmylistnum.call();
    }).then(function(returnv){
      mywishlistidx = returnv.toString();
    }).then(function(){

      var testvar = 0;
      //n초동안 get함수 받아옴.
      intervaltest = setInterval(function(){

        connectresult = false;
        connectedidx = 0;

        if(testvar<60){
          demoInstance.getmyChanelState.call(mywishlistidx).then(function(v){
            connectresult = v[0];
            connectedidx = v[1].toString();
            testvar++;
            console.log('connecting...');
          });
        }

        // 타겟 wishlist 존재함
        // wishlist 두개묶어서 chanelobject로만듬
        if(connectresult)
        {

        }
        
        //timeout
        if(testvar == 60){         
          console.log(connectresult);
          console.log(connectedidx);
          clearInterval(intervaltest);
        }


      }, 1000);
    });
  },
  */

};



//$(function() {
//  $(window).load(function() {
//    App.init();
//  });
//});
