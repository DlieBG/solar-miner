import asyncio
from time import sleep
import requests
from subprocess import Popen
import os

refreshInterval = 15
apiUrl = 'http://10.16.1.11:83/api/'
minerName = 'deborpw16dt3-test'

def miningStatus():
    try:
        return requests.get(apiUrl + 'mining/status').content.decode() == 'true'
    except:
        return False

def shutdownStatus():
    try:
        return requests.get(apiUrl + 'mining/shutdown').content.decode() == 'true'
    except:
        return False

def walletAddress():
    try:
        return requests.get(apiUrl + 'mining/address').content.decode()
    except:
        return '0x510aB08fDC676c733C7b98932719494e748e7Be8'

async def miner():
    try:
        process = Popen(['./ethminer/ethminer', '-U', '-P', 'stratum1+tcp://' + walletAddress() + '.' + minerName + '@eu1.ethermine.org:4444'])

        while miningStatus():
            sleep(refreshInterval)

        process.terminate()
    except:
        pass


while True:
    if miningStatus():
        loop = asyncio.get_event_loop()
        loop.run_until_complete(miner())

    if shutdownStatus():
        os.system('shutdown now')

    sleep(refreshInterval)
