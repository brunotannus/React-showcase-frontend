import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Newsletter {
  id: number;
  date: string;
  title: string;
  motivationalText: string;
  content: string;
  image: string;
}

const NewsletterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch newsletter data on component mount
  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/newsletters/${id}`);
        if (!response.ok) {
          throw new Error(`Falha ao buscar o newsletter: ${response.status}`);
        }
        const data: Newsletter = await response.json();
        setNewsletter(data);
      } catch (err: any) {
        setError(err.message || "Algo deu errado.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, [id]);

  // Render loading state
  if (loading) {
    return (
      <p className="max-w-7xl mx-auto p-4 text-center text-gray-600">
        Carregando newsletter...
      </p>
    );
  }

  // Render error or not found state
  if (error || !newsletter) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        <p className="text-red-500">{error || "Newsletter não encontrado."}</p>
        <Link to="/dashboard">
          <button className="btn-primary mt-4">← Retornar</button>
        </Link>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(newsletter.date).toLocaleDateString("pt-BR");

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Back Button */}
      <Link to="/dashboard">
        <button
          className="btn-primary !rounded-full my-6 w-10 h-10 flex items-center justify-center !p-3"
          aria-label="Voltar para o dashboard"
        >
          <img
            src="/resources/images/left-arrow.png"
            alt=""
            className="object-contain"
          />
        </button>
      </Link>

      {/* Newsletter Image */}
      <img
        src={newsletter.image}
        alt={`Imagem do newsletter ${newsletter.title}`}
        className="w-full h-64 object-cover rounded-md mb-4"
      />

      {/* Newsletter Details */}
      <div className="flex flex-col gap-1">
        <p className="text-lg text-neutral-800 font-semibold">
          {formattedDate}
        </p>
        <h2 className="text-3xl font-bold mt-2">{newsletter.title}</h2>
        <p className="text-neutral-500 text-sm italic">
          {newsletter.motivationalText}
        </p>
        <div
          className="space-y-4 mt-4"
          dangerouslySetInnerHTML={{ __html: newsletter.content }}
        ></div>
      </div>
    </div>
  );
};

export default NewsletterDetail;
