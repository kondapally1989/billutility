// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var $ = require('jquery')
 $(document).ready(function(){

    $("#a_current_bill").on('click', function(){
      $("#current_bill").show();
      $("#credit_card").hide();
    });

    $("#a_credit_card").on('click', function(){
      $("#current_bill").hide();
      $("#credit_card").show();
    });


  })