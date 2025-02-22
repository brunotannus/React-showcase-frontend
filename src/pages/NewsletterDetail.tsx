import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Newsletter {
  id: number; // or string, if your IDs are strings
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

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(`http://localhost:3001/newsletters/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch newsletter: ${response.status}`);
        }
        const data = await response.json();
        setNewsletter(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletter();
  }, [id]);

  if (loading) {
    return <p className="max-w-7xl mx-auto p-4">Loading newsletter...</p>;
  }

  if (error || !newsletter) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <p className="text-red-500">{error || "Newsletter not found."}</p>
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          <button className="btn-primary">←</button>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(newsletter.date).toLocaleDateString("pt-BR");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/dashboard">
        <button className="btn-primary !rounded-full my-6 w-10 h-10 flex items-center justify-center !p-3">
          <img
            src="/resources/images/left-arrow.png"
            alt="Back"
            className="object-contain"
          />
        </button>
      </Link>
      <img
        src={newsletter.image}
        alt={newsletter.title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <div className="flex flex-col gap-1">
        <p className="text-lg text-neutral-800 font-semibold">
          {formattedDate}
        </p>
        <h2 className="text-3xl font-bold mt-2">{newsletter.title}</h2>
        <p className="text-tn-gray text-sm">{newsletter.motivationalText}</p>
        <div
          className="space-y-4 mt-4"
          dangerouslySetInnerHTML={{ __html: newsletter.content }}
        ></div>
      </div>
    </div>
  );
};

export default NewsletterDetail;
