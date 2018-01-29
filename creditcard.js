// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var $ = require('jquery');
var yaml = require('js-yaml');
var fs = require('fs');
var creMap = {};
window.creMap = creMap;

/*credit_card_details:
    - name: narasimha
      type: debit
      name: karthik
      num: 4591567891233715
      exp_month: '04'
      exp_year: 2021
      cvv: 302*/


$(document).ready(function () {
    d_yaml = yaml.load(fs.readFileSync("./1.yaml"));
    $.each(d_yaml['credit_card_details'], function(val, text) {
        creMap[text['num']] = {
            'name': text['name'],
            'type': text['type'],
            'exp_month': text['exp_month'],
            'exp_year': text['exp_year'],
            'cvv': text['cvv']
        }
        $('#sel_cre').append($('<option>' + text['num'] + ' '+text['name'] + '</option>').val(text['num']))
    });
    
    $('#sel_cre').on('change', function() {
        val = this.value
        $("#cnum").val(val);
        $("#cname").val(creMap[val]['name']);
        $("#cm").val(creMap[val]['exp_month']);
        $("#cy").val(creMap[val]['exp_year']);
        $("#cvv").val(creMap[val]['cvv']);
        $("#ctype").val(creMap[val]['type']);
    });


    $("#plusCreditCard").click(function() {
        d_yaml = yaml.load(fs.readFileSync("./1.yaml"));
        var cnum = $("#cnum").val();
        var name = $("#cname").val();
        cm = $("#cm").val();
        cy = $("#cy").val();
        cvv = $("#cvv").val();
        ctype = $("#ctype").val();
        var list = d_yaml['credit_card_details'];
        var newlist = []
        var set = 0
        $.each(list, function(val, obj) {
            if (obj['num'] == cnum) {
                obj['num'] = cnum;
                obj['name'] = name;
                obj['exp_month'] = cm;
                obj['exp_year'] = cy;
                obj['cvv'] = cvv;
                obj['type'] = ctype;
                set = 1;
            }
            newlist.push(obj)
        });
        if (set == 0) {
            newlist.push({
            'num' : cnum,    
            'name': name,
            'exp_month': cm,
            'exp_year': cy,
            'cvv': cvv,
            'type': ctype
            });
        }
        d_yaml['credit_card_details'] = newlist
        fs.writeFile("./1.yaml", yaml.dump(d_yaml), function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        console.log('test' + yaml.dump(d_yaml))
        location.reload();
    });

})