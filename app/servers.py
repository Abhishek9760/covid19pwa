import requests

def get_world_data():
    data = requests.get("https://api.covid19api.com/world/total").json()
    return data
