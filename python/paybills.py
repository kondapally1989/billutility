
from selenium import webdriver
import yaml
import time
import sys

config_file = "../config.yaml"

class User:

	def __init__(self, name, email, card_type, card_number, cvv, exp_month, exp_year):
		self.name = name
		self.email =email
		self.card_number = card_number
		self.card_type =card_type
		self.cvv = cvv
		self.exp_year = exp_year
		self.exp_month = exp_month

class Bills(object):

	def __init__(self):
		self.load_config()

	def load_config(self):
		self.config = yaml.load(open(config_file))

	def get_current_bill_details(self):
		return self.config.get("current_details")

	def get_water_bill_details(self):
		return self.config.get("water_details")

	def open_browser(self, url):
		chrome = webdriver.Chrome()
		chrome.get(url)
		return chrome


def WaterBill(Bills):
	def __init__(self, user, **kwargs):
		super(WaterBill, self).__init__()
		self.user = user
		self.can = kwargs.get("can")
		assert self.can, "Not a valid CAN"

	def pay(self):
		details = self.get_water_bill_details()
		url = details.get("current_url")
		webpage = self.open_browser(url)


class CurrentBill(Bills):

	def __init__(self, user, **kwargs):
		super(CurrentBill, self).__init__()
		self.user = user
		# assert 0, kwargs
		self.usc_no = kwargs.get("usc_no")
		assert self.usc_no, "Not a valid USC"

	def pay(self):
		details = self.get_current_bill_details()
		url = details.get("current_url")
		webpage = self.open_browser(url)
		search_field = webpage.find_element_by_name("uscno")
		search_field.clear()
		search_field.send_keys(self.usc_no)
		make_payment = webpage.find_element_by_name("makePayment")
		mail_id = webpage.find_element_by_name("txtEmailID")
		mail_id.send_keys(self.user.email)
		make_payment.click()
		webpage.implicitly_wait(30)
		submit = webpage.find_element_by_name("button2")
		submit.click()
		webpage.switch_to.alert.accept();
		webpage.implicitly_wait(30)
		card_type = self.user.card_type
		if card_type == "debit":
			debit = webpage.find_element_by_xpath("//*[@data-value='txtBankIDDC-CARD']")
			debit.click()
		credit_card_no_input = webpage.find_element_by_name("cnumber")
		credit_card_no_input.send_keys(self.user.card_number)
		exp_date_mon = webpage.find_element_by_name("expmon")
		exp_date_mon.find_element_by_xpath("//*[@value='"+credit_card["exp_month"]+"']")
		exp_date_mon.click()
		exp_date_mon.send_keys(self.user.exp_month)
		exp_date_year = webpage.find_element_by_name("expyr")
		exp_date_year.send_keys(self.user.exp_year)
		cvv = webpage.find_element_by_name("cvv2")
		cvv.send_keys(self.user.cvv)
		credit_card_name = webpage.find_element_by_name("cname2")
		credit_card_name.send_keys(credit_card["name"])
		credit_make_payment = webpage.find_element_by_id("proceedForm")
		credit_make_payment.click()
		time.sleep(3000)

if __name__ == '__main__':
	args = sys.argv
	bill_type = args[1]
	bills = {
		"current" : (CurrentBill, "usc_no"),
		"water" : (WaterBill,"can")
		}

	try:
		Bill, params = bills[bill_type]
		name, email, ct, cn, cvv, em, ey = args[2],args[3],args[4],args[5],args[6],args[7],args[8]
		user = User(name, email, ct, cn, cvv, em, ey)
		bill_id = args[9]
		kwargs = {params : bill_id}
		bill = Bill(user, **kwargs)
		bill.pay()
	except KeyError as e:
		print "You can pay only water/current bill"