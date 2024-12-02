const PAYLOADCMS_URL = process.env.PAYLOADCMS_URL;

export interface PageData {
  id?: string;
  title: string;
  description?: string;
  htmlContent?: string;
  cssContent?: string;
  gjsData?: any;
}

export async function fetchPages() {
  const response = await fetch(`${"http://localhost:8000"}/api/pages`);
  const data = await response.json();
  console.log(data);
  return data.docs;
}

export async function fetchPageById(id: string) {
  const response = await fetch(`${PAYLOADCMS_URL}/api/pages/${id}`);
  return response.json();
}

export async function createPage(pageData: PageData) {
  const response = await fetch(`http://localhost:8000/api/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageData),
  });
  return response.json();
}

export async function updatePage(id: string, pageData: PageData) {
  const response = await fetch(`${PAYLOADCMS_URL}/api/pages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageData),
  });
  return response.json();
}

export async function deletePage(id: string) {
  const response = await fetch(`${PAYLOADCMS_URL}/api/pages/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
