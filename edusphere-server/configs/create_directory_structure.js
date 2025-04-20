export const createFolder = async (folderName, accessToken, parentId) => {
    const metadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    };
  
    const response = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
  
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create folder:', error);
      throw new Error(error.error.message);
    }
  
    const data = await response.json();
    console.log('Created folder:', data);
    return data.id;
  };
  