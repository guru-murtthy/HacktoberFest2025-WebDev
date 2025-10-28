import random
import string

def generate_password(length=12, use_special=True):
    chars = string.ascii_letters + string.digits
    if use_special:
        chars += string.punctuation
    
    password = ''.join(random.choice(chars) for _ in range(length))
    return password
  
length = int(input("Enter password length: "))
use_special = input("Include special characters? (y/n): ").lower() == 'y'
print(f"Generated Password: {generate_password(length, use_special)}")
