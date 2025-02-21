import React from "react";
import { Link } from "react-router-dom";

interface NewsletterCardProps {
  id: string;
  image: string;
  date: Date;
}

const NewsletterCard: React.FC<NewsletterCardProps> = ({ id, image, date }) => {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  const calculateStreak = () => {
    console.log(localStorage.getItem("user"));
  };
  return (
    <Link to={`/newsletter/${id}`} onClick={calculateStreak}>
      <div className="bg-tn-yellow max-w-96 overflow-hidden rounded-lg border border-gray-200 p-0 cursor-pointer hover:shadow-md transition-shadow">
        <img
          src={image}
          alt="Newsletter"
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
