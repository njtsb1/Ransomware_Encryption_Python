import os
import pyaes

## open the encrypted file
file_name = "test.txt.ransomwaretroll"
file = open(file_name, "rb")
file_data = file.read()
file.close()

## decryption key
key = b"testeransomwares"
aes = pyaes.AESModeOfOperationCTR(key)
decrypt_data = aes.decrypt(file_data)

## remove the encrypted file
os.remove(file_name)

## create the decrypted file
new_file_name = "test.txt"
new_file = open(new_file_name, "wb")
new_file.write(decrypt_data)
new_file.close()
