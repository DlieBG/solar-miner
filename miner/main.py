import asyncio
from time import sleep, time
import requests
from subprocess import Popen
import os
import dotenv
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
dotenv.load_dotenv(dotenv_path)

refreshInterval = int(os.getenv("REFRESH_INTERVALL", "10"))
restartInterval = int(os.getenv("RESTART_INTERVALL", "40"))
apiUrl = os.getenv("API_URL")
apiUrl = apiUrl if apiUrl.endswith("/") else apiUrl + "/"
minerName = os.getenv("MINER_NAME")

def miningStatus():
    try:
        return requests.get(apiUrl + 'mining/status').json()
    except:
        return False

def shutdownStatus():
    try:
        return requests.get(apiUrl + 'mining/shutdown').json()
    except:
        return False

def walletAddress():
    try:
        return requests.get(apiUrl + 'mining/address').json()
    except:
        return '0x510aB08fDC676c733C7b98932719494e748e7Be8'

async def miner():
    try:
        start = time()

        process = Popen(['./ethminer/ethminer', '-R', '--exit', '-U', '-P', 'stratum1+tcp://' + walletAddress() + '.' + minerName + '@eu1.ethermine.org:4444'])
        
        while miningStatus() and time() - start < restartInterval * 60:
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
