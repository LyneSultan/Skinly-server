import axios from 'axios';
import fs from 'fs';

export const sendProductData = async (companyId, jsonFilePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    for (const product of data) {
      const response = await axios.post(`http://localhost:3000/admin/addProduct/${companyId}`, product);
      console.log('API Response for product:', response.data);
    }
  } catch (error) {
    console.error('Error sending product data:', error.response?.data?.message || error.message);
  }
}

