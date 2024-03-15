import os

def rename_files(directory, unwanted_part):
    # List all files in the specified directory
    for filename in os.listdir(directory):
        if unwanted_part in filename:
            # Construct the full file path
            old_file = os.path.join(directory, filename)
            # Define the new file name by removing the unwanted part
            new_file = os.path.join(directory, filename.replace(unwanted_part, ''))
            # Rename the file
            os.rename(old_file, new_file)
            print(f'Renamed "{old_file}" to "{new_file}"')

# Example usage:
directory_path = './downloaded_images'
unwanted_part = '?c'  # This is an example, adjust based on actual need
rename_files(directory_path, unwanted_part)
