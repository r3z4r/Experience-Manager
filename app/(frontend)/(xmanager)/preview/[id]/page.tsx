async function getTemplate(id: string) {
  const response = await fetch(
    `${process.env.PAYLOADCMS_URL}/api/templates/${id}`
  );
  return response.json();
}

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const template = await getTemplate(params.id);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: template.css }} />
      <div dangerouslySetInnerHTML={{ __html: template.html }} />
    </>
  );
}
