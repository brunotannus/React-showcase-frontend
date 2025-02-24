import React from "react";
import { Link } from "react-router-dom";

interface NewsletterCardProps {
  id: string;
  image: string;
  date: string;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ id, image, date }) => {
  // Format date to "pt-BR" locale
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  // Handle card click: Update user history in the backend
  const handleCardClick = async () => {
    const userString = localStorage.getItem("user");
    const simulatedDate = localStorage.getItem("simulatedDate");

    if (!userString) {
      console.error("Nenhum usuário logado encontrado no localStorage.");
      return;
    }

    if (!simulatedDate) {
      console.error("Data simulada não encontrada no localStorage.");
      return;
    }

    const user = JSON.parse(userString);

    // Prepare payload for backend request
    const payload = {
      newsletterId: id,
      simulatedDate,
    };

    try {
      // Make POST request to update user's history
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/history`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Falha ao atualizar histórico: ${response.status}`);
      }

      console.log("Histórico do usuário atualizado com sucesso.");
    } catch (error: any) {
      console.error("Erro ao atualizar histórico do usuário:", error.message);
    }
  };

  return (
    <Link
      to={`/newsletter/${id}`}
      onClick={handleCardClick}
      aria-label={`Visualizar newsletter de ${formattedDate}`}
    >
      <div className="bg-tn-yellow max-w-96 overflow-hidden rounded-lg border border-gray-200 p-0 cursor-pointer hover:shadow-md hover:-translate-x-1 hover:-translate-y-1 transition-all ease-in-out">
        <img
          src={image}
          alt={`Imagem do newsletter de ${formattedDate}`}
          className="w-full h-48 object-cover"
        />
        <p className="my-4 mx-4 text-neutral-800 text-xl font-semibold">
          {formattedDate}
        </p>
      </div>
    </Link>
  );
};

export default NewsletterCard;
