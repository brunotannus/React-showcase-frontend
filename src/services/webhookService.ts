export const fetchWebhookData = async () => {
  try {
    const response = await fetch(
      "https://backend.testeswaffle.org/webhooks/case/publication/teste/post/post_00000000-0000-0000-0000-000000000000"
    );
    if (!response.ok) throw new Error("Erro ao buscar dados do webhook");
    const data = await response.json();
    console.log("Dados recebidos:", data);
    return data;
  } catch (error) {
    console.error(error);
  }
};
