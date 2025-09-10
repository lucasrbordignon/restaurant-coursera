export async function getJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Falha ao obter dados:', error);
    throw error;
  }
}

export async function getHtml(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Falha ao obter dados HTML:', error);
    throw error;
  }
}