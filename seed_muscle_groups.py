import requests


API_URL = "https://gymly-api.onrender.com/api/muscle-groups"


login_url = "https://gymly-api.onrender.com/api/login"
login_data = {
    "email": "test@email.com",  
    "password": "password123"    
}

response = requests.post(login_url, json=login_data)
if response.status_code != 200:
    print(" Login failed:", response.text)
    exit()

token = response.json()["token"]
headers = {"Authorization": f"Bearer {token}"}


groups = ["Chest", "Arms", "Back", "Legs", "Shoulders", "Core", "Glutes", "Calves"]


for name in groups:
    response = requests.post(API_URL, json={"name": name}, headers=headers)
    if response.status_code == 201:
        print(f" Added: {name}")
    elif response.status_code == 409:
        print(f" Already exists: {name}")
    else:
        print(f"Failed to add {name}:", response.text)

print("Done!")