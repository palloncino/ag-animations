import requests
import os

# Ensure you have the 'requests' library installed:
# pip install requests

def download_images(image_urls_file, download_folder):
    # Create the download folder if it doesn't exist
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    with open(image_urls_file, 'r') as file:
        urls = file.readlines()

    for url in urls:
        url = url.strip()
        file_name = url.split('/')[-1]  # Extracts the file name from the URL
        response = requests.get(url)
        if response.status_code == 200:
            file_path = os.path.join(download_folder, file_name)
            with open(file_path, 'wb') as img:
                img.write(response.content)
            print(f'Downloaded {file_name}')
        else:
            print(f'Failed to download {file_name}')

# Example usage
image_urls_file = 'image_urls.txt'  # This file should contain one image URL per line
download_folder = 'downloaded_images'
download_images(image_urls_file, download_folder)
