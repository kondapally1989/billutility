// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var $ = require('jquery')
var yaml = require('js-yaml');
var fs = require('fs');
var custMap = {};
var creMap = {};
window.custMap = custMap;
window.creMap = creMap;
  var
        { spawnSync } = require( 'child_process' ),
                            command = spawnSync('ls', ['.'] );
console.log( `stderr: ${command.stderr.toString()}` );
              console.log( `stdout: ${command.stdout.toString()}` );


$(document).ready(function() {

   // /var sidebar = $(".sidebar-menu").children("li:last").remove();
   

    d_yaml = yaml.load(fs.readFileSync("./config.yaml"));
    $.each(d_yaml['current_details']['customer'], function(val, text) {
        custMap[text['usc_no']] = {
            'name': text['name'],
            'mail_id': text['mail_id']
        }
        $('#sel_cus').append($('<option>' + text['name'] + '</option>').val(text['usc_no']))
    });
    $('#sel_cus').on('change', function() {
        val = this.value
        $("#usc_no").val(val);
        $("#name").val(custMap[val]['name']);
        $("#mail_id").val(custMap[val]['mail_id'])
    })

    $("#a_current_bill").on('click', function() {
        $("#current_bill").show();
        $("#credit_card").hide();
    });

    $("#a_credit_card").on('click', function() {
        $("#current_bill").hide();
        $("#credit_card").show();
    });

    $("#plusCurrentUser").click(function() {
        d_yaml = yaml.load(fs.readFileSync("./config.yaml"));
        var usc_no = $("#usc_no").val();
        usc_no = parseInt(usc_no)
        var name = $("#name").val();
        var mail_id = $("#mail_id").val();
        var list = d_yaml['current_details']['customer']
        var newlist = []
        var set = 0
        $.each(list, function(val, obj) {
            if (obj['usc_no'] == usc_no) {
                obj['name'] = name;
                obj['mail_id'] = mail_id;
                set = 1;
            }
            newlist.push(obj)
        });
        if (set == 0) {
            newlist.push({
                'usc_no': usc_no,
                'name': name,
                'mail_id': mail_id
            })
        }
        d_yaml['current_details']['customer'] = newlist
        fs.writeFile("./config.yaml", yaml.dump(d_yaml), function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        console.log('test' + yaml.dump(d_yaml))
        location.reload();
    });
    
    $.each(d_yaml['credit_card_details'], function(val, text) {
        creMap[text['num']] = {
            'name': text['name'],
            'type': text['type'],
            'exp_month': text['exp_month'],
            'exp_year': text['exp_year'],
            'cvv': text['cvv'] 
        }
        $('#sel_cre2').append($('<option>' + text['num'] + ' '+text['name'] + '</option>').val(text['num']))
    });
    
    $("#pay-bill").on('click', function(){
        try{
        var usc_no = $("#usc_no").val();
        var name = $("#name").val();
        var mail_id = $("#mail_id").val();
        var cval = $('#sel_cre2').val();
        var cname = creMap[cval]['name'];
        var cm  = creMap[cval]['exp_month'];
        var cy = creMap[cval]['exp_year'];
        var cvv = creMap[cval]['cvv'];
        var ctype = creMap[cval]['type'];
        
                            //command = spawnSync('ls', ['.'] );

            command = spawnSync('python', ['./python/current-bill.py',usc_no,mail_id,cval.toString(),cm,cy,cvv,cname,ctype ] );
              console.log( `stderr: ${command.stderr.toString()}` );
              console.log( `stdout: ${command.stdout.toString()}` );
        }
        catch(e){
            console.log(e);
        }
    }).bind(spawnSync);
                      

})