def curentBill(driver, current,cust_details,credit_card):
	d = webdriver.Chrome(driver)
	d.get(current['current_url'])
	search_field = d.find_element_by_name("uscno")
	search_field.clear()

	search_field.send_keys(cust_details['usc_no'])
	make_payment = d.find_element_by_name("makePayment")
	mail_id = d.find_element_by_name("txtEmailID")
	mail_id.send_keys(cust_details['mail_id'])
	make_payment.click()
	d.implicitly_wait(30)
	submit = d.find_element_by_name("button2")
	submit.click()
	d.switch_to.alert.accept();
	d.implicitly_wait(30)
	card_type = credit_card["type"]
	if card_type == "debit":
		debit = d.find_element_by_xpath("//*[@data-value='txtBankIDDC-CARD']")
		debit.click()
	credit_card_no_input = d.find_element_by_name("cnumber")
	credit_card_no_input.send_keys(credit_card["num"])
	exp_date_mon = d.find_element_by_name("expmon")
	exp_date_mon.find_element_by_xpath("//*[@value='"+credit_card["exp_month"]+"']")
	exp_date_mon.click()
	exp_date_mon.send_keys(credit_card["exp_month"])
	exp_date_year = d.find_element_by_name("expyr")
	exp_date_year.send_keys(credit_card["exp_year"])
	cvv = d.find_element_by_name("cvv2")
	cvv.send_keys(credit_card["cvv"])
	credit_card_name = d.find_element_by_name("cname2")
	credit_card_name.send_keys(credit_card["name"])
	credit_make_payment = d.find_element_by_id("proceedForm")
	credit_make_payment.click()
	time.sleep(3000)

    

from selenium import webdriver
import yaml
import time
import sys


diction = yaml.load(open('./config.yaml'))
  
diction['current_details']['customer'][0]['usc_no'] = sys.argv[1]
diction['current_details']['customer'][0]['mail_id'] = sys.argv[2]
diction['credit_card_details']['user']['num'] =  sys.argv[3]
diction['credit_card_details']['user']['exp_month'] = sys.argv[4]
diction['credit_card_details']['user']['exp_year'] = sys.argv[5]
diction['credit_card_details']['user']['cvv'] = sys.argv[6]
diction['credit_card_details']['user']['name'] = sys.argv[7]
diction['credit_card_details']['user']['type'] = sys.argv[8]


curentBill(diction['driver'], diction['current_details'], diction['current_details']['customer'][0], diction['credit_card_details']['user'] )

