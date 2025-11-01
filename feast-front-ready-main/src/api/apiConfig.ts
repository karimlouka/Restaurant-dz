// apiConfig.ts
// عنوان API الأساسي المستضاف على Render
export const BASE_URL = 'https://restaurant-dz.onrender.com';

// دالة مساعدة لجلب البيانات
export async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

// دالة مساعدة لإرسال البيانات (POST, PUT, DELETE)
export async function sendData<T>(endpoint: string, method: 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 204) { // No Content for successful DELETE
    return {} as T;
  }

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const errorBody = await response.json();
      errorDetail = errorBody.message || errorDetail;
    } catch (e) {
      // ignore
    }
    throw new Error(`API call failed on ${endpoint} (${method}): ${errorDetail}`);
  }
  
  return response.json() as Promise<T>;
}

// مسارات API المفترضة (قد تحتاج لتعديلها حسب الـ Backend الفعلي)
export const API_ENDPOINTS = {
  dishes: '/api/dishes',
  orders: '/api/orders',
  users: '/api/users',
};
