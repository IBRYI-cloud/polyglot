import http from 'http';

function makeHttpRequest<T>(url: string, options: http.RequestOptions = {}, postData: string | null = null): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } else {
            reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
          }
        } catch (e) {
          reject(new Error('Failed to parse JSON response.'));
        }
      });
    });
    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

interface OllamaGenerateResponse {
  response: string;
}

export async function generateOllamaResponse(model: string, prompt: string): Promise<string> {
  const payload = { 
    model, 
    prompt, 
    stream: false,
    keep_alive: 0 
  };
  const postData = JSON.stringify(payload);

  const options = {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
  };

  try {
    const result = await makeHttpRequest<OllamaGenerateResponse>(
      'http://localhost:11434/api/generate',
      options,
      postData
    );
    return result.response.trim();
  } catch (error) {
    throw new Error(`Failed to get response from Ollama: ${(error as Error).message}`);
  }
}

interface OllamaTagsResponse {
  models: { name: string }[];
}

export async function getOllamaModels() {
  try {
    const data = await makeHttpRequest<OllamaTagsResponse>('http://localhost:11434/api/tags');
    return { success: true, models: data.models || [] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function checkOllamaStatus() {
  try {
    await makeHttpRequest('http://localhost:11434/api/tags');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}